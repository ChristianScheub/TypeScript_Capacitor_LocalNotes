import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./cookieConsentBanner.css";

const CookieConsentBanner: React.FC = () => {
  const [isCookieAccepted, setIsCookieAccepted] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(true);
  const [isProgressSavingEnabled, setIsProgressSavingEnabled] =
    useState<boolean>(false);
  const [isUsernameSavingEnabled, setIsUsernameSavingEnabled] =
    useState<boolean>(false);
  const [isBannerAllowed, setIsBannerAllowed] = useState<boolean>(true);
  const [isGerman, setIsGerman] = useState<boolean>(false);

  useEffect(() => {
    const browserLanguage = navigator.language.toLowerCase();
    setIsGerman(browserLanguage.startsWith("de"));
    const currentPagePath = window.location.pathname;
    if (
      currentPagePath.includes("/impressum") ||
      currentPagePath.includes("/datenschutz")
    ) {
      setIsBannerAllowed(false);
    }
  }, []);

  const onAccept = () => {
    setIsCookieAccepted(true);
    setIsPopupVisible(false);
    localStorage.setItem("progress-saving-enabled", "true");
    localStorage.setItem("username-saving-enabled", "true");
  };

  const onDeclineAll = () => {
    localStorage.removeItem("completedLessons");
    localStorage.removeItem("progress-saving-enabled");
    localStorage.removeItem("username-saving-enabled");
    setIsPopupVisible(false);
    setIsCookieAccepted(true);
  };

  const onSaveSettings = () => {
    setIsPopupVisible(false);
    if (isProgressSavingEnabled) {
      localStorage.setItem(
        "progress-saving-enabled",
        String(isProgressSavingEnabled)
      );
    } else if (isUsernameSavingEnabled) {
      localStorage.setItem(
        "username-saving-enabled",
        String(isUsernameSavingEnabled)
      );
    }
    if (isProgressSavingEnabled || isUsernameSavingEnabled) {
      setIsCookieAccepted(true);
    } else {
      setIsCookieAccepted(true);
      onDeclineAll();
    }
  };

  const onCustomizeSettings = () => {
    setIsPopupVisible(false);
  };

  if (isCookieAccepted) {
    return null;
  }

  return (
    <>
      {isBannerAllowed && (
        <div>
          {isPopupVisible && (
            <Modal show={true} centered>
              <Modal.Header>
                <Modal.Title>Lokale Daten Speicherung</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="cookie-overlay-content">
                  <div className="cookie-overlay-text">
                    {isGerman ? (
                      <>
                        Diese Website verwendet den lokalen Speicher, um Ihren
                        Fortschritt in den Unterrichtseinheiten, Ihren
                        Benutzernamen sowie Ihr Einverständnis hierzu lokal in
                        Ihrem Browser zu speichern. <br /> Es werden allerdings
                        keine Cookies gespeichert und keine Daten an unsere
                        Server versendet, da diese Webanwendung ohne einen
                        zusätzlichen Server von uns funktioniert. <br /> Klicken
                        Sie auf "Einstellungen anpassen", um einzeln
                        auszuwählen, was lokal gespeichert wird, oder auf "Alle
                        ablehnen", falls Sie damit nicht einverstanden sind.{" "}
                        <br /> Falls Sie nicht einverstanden sind, funktionieren
                        einzelne Funktionen wie das Dashboard oder der
                        Lernfortschritt nicht. <br /> Ihr Einverständis hierzu
                        können sie ändern indem sie die Seite neu laden, dann
                        erscheint dieser Banner neu.
                        <br />
                        Bitte berücksichtigen Sie das wir keine Daten von ihnen
                        erhalten und folglich auch keine Daten verkaufen oder
                        Ähnliches.
                        <br /> Weitere Informationen zu der Datenspeicherung
                        finden sie hier: <a href="/datenschutz">Datenschutz</a>
                        <br /> Informationen zu uns finden sie unter:
                        <a href="/impressum">Impressum</a>
                      </>
                    ) : (
                      <>
                        This website uses local storage to store your lesson
                        progress, username and consent locally in your browser.{" "}
                        <br /> However, no cookies are stored and no data is
                        sent to our server, as this web application works
                        without an additional server from us. <br /> Click
                        "Customize Settings" to individually choose what is
                        stored locally, or click "Decline All" if you disagree.{" "}
                        <br /> If you disagree, works individual functions such
                        as the dashboard or learning progress are not. <br />{" "}
                        You can change your consent to this by reloading the
                        page, then this banner will appear again.
                        <br /> Please note that we do not receive any data from
                        you and therefore do not sell any data or anything
                        similar. <br />
                        For more information, please visit our privacy policy
                        page.
                        <a href="/datenschutz">Privacy Policy</a> <br />
                        For additional information about us, please refer to our
                        impressum page.
                        <a href="/impressum">Impressum</a> <br />
                      </>
                    )}
                  </div>
                  <div className="button-group">
                    <Button
                      variant="primary"
                      onClick={onAccept}
                      style={{ margin: "0 0.5vw" }}
                      data-testid="accept-all-button" 
                    >
                      {isGerman ? "Alle akzeptieren" : "Accept All"}
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={onDeclineAll}
                      style={{ margin: "0 0.5vw" }}
                      data-testid="decline-all-button"
                    >
                      {isGerman ? "Alle ablehnen" : "Decline All"}
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={onCustomizeSettings}
                      style={{ margin: "0 0.5vw" }}
                    >
                      {isGerman
                        ? "Einstellungen anpassen"
                        : "Customize Settings"}{" "}
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}
          {!isPopupVisible && (
            <Modal show={true} centered>
              <Modal.Header>
                <Modal.Title>Cookie-Einstellungen anpassen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="cookie-overlay-text">
                  {isGerman ? (
                    <>
                      Pro Einstellung werden zwei Werte im LocalStorage in Ihrem
                      Browser gespeichert. Einmal dass Sie mit der Speicherung
                      einverstanden sind und zusätzlich der Wert für die
                      jeweilige Einstellung.
                    </>
                  ) : (
                    <>
                      For each setting, two values are stored in LocalStorage in
                      your browser saved. Once that you start storing agree and
                      additionally the value for the respective Attitude.
                    </>
                  )}
                </div>
                <Form>
                  <Form.Group controlId="formProgressSaving">
                    <Form.Check
                      type="checkbox"
                      label={
                        isGerman
                          ? "Aktuellen Lernfortschritt speichern"
                          : "Save current learning progress"
                      }
                      checked={isProgressSavingEnabled}
                      onChange={() =>
                        setIsProgressSavingEnabled((prevState) => !prevState)
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formUsernameSaving">
                    <Form.Check
                      type="checkbox"
                      label={isGerman ? "Username speichern" : "Save username"}
                      checked={isUsernameSavingEnabled}
                      onChange={() =>
                        setIsUsernameSavingEnabled((prevState) => !prevState)
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setIsPopupVisible(true)}
                >
                  {isGerman ? "Abbrechen" : "Cancel"}
                </Button>
                <Button variant="primary" onClick={onSaveSettings}>
                  {isGerman ? "Speichern" : "Save"}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default CookieConsentBanner;
