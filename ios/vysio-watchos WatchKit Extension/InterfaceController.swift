//
//  InterfaceController.swift
//  vysio-watchos WatchKit Extension
//
//  Created by Peter Marshall on 2021-10-14.
//

import WatchKit
import Foundation
import WatchConnectivity
import CoreMotion

class InterfaceController: WKInterfaceController, WCSessionDelegate, WKExtendedRuntimeSessionDelegate {
  @IBOutlet weak var label: WKInterfaceLabel!
  
  var session: WCSession?

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
      print("Did activate")
    }

  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
    if WCSession.isSupported() {
      print("Activating watch session")
      self.session = WCSession.default
      self.session?.delegate = self
      self.session?.activate()
    }
    
    // Set up accelerometer data
    let motionManager = CMMotionManager()
    print("Setting up accelerometer")
    if motionManager.isAccelerometerAvailable {
      motionManager.accelerometerUpdateInterval = 1
      print("Accelerometer available")
      motionManager.startAccelerometerUpdates(to: OperationQueue.current!, withHandler: { (CMdata, error) in
        print("Got data")
        if let data = CMdata {
          let x = data.acceleration.x
          let y = data.acceleration.y
          let z = data.acceleration.z
          print("Sending acceleration coordinates: ", x)
          self.session?.sendMessage([
            "accelerometer": [
              "x": x,
              "y": y,
              "z": z,
            ]
          ], replyHandler: nil)
        }
        print("Error: ", error)
      })
    } else {
      print("Accelerometor not available")
    }
  }
  
  override func willActivate() {
      // This method is called when watch view controller is about to be visible to user
    super.willActivate()
  }
  
  override func didDeactivate() {
      // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }

  func session(
    _ session: WCSession,
    didReceiveMessage message: [String: Any],
    replyHandler: @escaping ([String: Any]) -> Void
  ) {
    print("Watch received message", message);
  
    let text = message["text"] as? String
    
    self.label.setText(text)
    print("Echoing message")
    replyHandler(["text": text])
  }

  func extendedRuntimeSessionDidStart(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
      // Track when your session starts.
  }

  func extendedRuntimeSessionWillExpire(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
      // Finish and clean up any tasks before the session ends.
  }
      
  func extendedRuntimeSession(_ extendedRuntimeSession: WKExtendedRuntimeSession, didInvalidateWith reason: WKExtendedRuntimeSessionInvalidationReason, error: Error?) {
      // Track when your session ends.
      // Also handle errors here.
  }
}
