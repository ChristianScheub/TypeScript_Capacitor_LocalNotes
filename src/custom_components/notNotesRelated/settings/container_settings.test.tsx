import React from "react";
import {
  render,
  fireEvent,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";
import SettingsContainer from "./container_settings";
import { MemoryRouter } from "react-router-dom";
import { encryptAndStore } from "../../handleNotes/encryptionEngine";
import { NativeBiometric } from "capacitor-native-biometric";
import * as fingerprintLogic from "../fingerprintLogic";
import { act } from "react";

jest.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: jest.fn().mockResolvedValue({ isAvailable: true }),
    verifyIdentity: jest.fn().mockResolvedValue(true),
    getCredentials: jest
      .fn()
      .mockResolvedValue({ password: "encryptedPassword" }),
    setCredentials: jest.fn().mockResolvedValue(undefined),
    deleteCredentials: jest.fn(),
  },
}));

jest.mock("@capacitor/filesystem", () => ({
  Filesystem: {
    writeFile: jest.fn(() => Promise.resolve({ uri: "mock-uri" })),
    getUri: jest.fn(),
  },
  Directory: {
    Documents: "Documents",
  },
}));

jest.mock("../fingerprintLogic", () => ({
  availableBiometric: jest.fn(),
  getPasswordFromFingerprint: jest.fn(),
  storePasswordFromFingerprint: jest.fn(),
}));


const renderWithRouter = (component: React.ReactElement): RenderResult => {
  return render(component, { wrapper: MemoryRouter });
};

beforeEach(() => {
  (fingerprintLogic.availableBiometric as jest.Mock).mockResolvedValue(true);
});


describe("Container Settings Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    global.Blob = jest.fn();
  });

  it("renders the settings view and initializes correctly", async () => {
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    expect(screen.getByTestId("settings-delete-all-Notes")).toBeInTheDocument();
  });

  it("handles deleting biometric credentials correctly", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId("settings-delete-bio-login"));
      expect(NativeBiometric.deleteCredentials).toHaveBeenCalled();
    });
  });

  it("handles deleting all notes correctly", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    await encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTescht"}',
      "some-encryption-key",
      "1"
    );
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    fireEvent.click(screen.getByTestId("settings-delete-all-Notes"));
    expect(localStorage.length).toBe(0);
    expect(window.confirm).toHaveBeenCalled();
  });

  it("handles exporting all notes correctly", async () => {
    await encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTescht"}',
      "some-encryption-key",
      "1"
    );
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    fireEvent.click(screen.getByTestId("settings-export-notes"));

    await waitFor(() => {
      expect(global.Blob).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
