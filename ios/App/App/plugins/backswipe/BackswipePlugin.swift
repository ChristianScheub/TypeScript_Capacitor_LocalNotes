//
//  BackswipePlugin.swift
//  App
//
//  Created by Christian Scheub on 19.12.23.
//

import Foundation
import Capacitor

@objc(BackswipePlugin)
public class BackswipePlugin: CAPPlugin {
   
    override public func load() {
        bridge?.webView?.allowsBackForwardNavigationGestures = true;
    }
}
