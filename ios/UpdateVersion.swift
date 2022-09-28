import Foundation

@objc(UpdateVersion)
class UpdateVersion: NSObject {
    @objc func updateIOS(_ options: NSDictionary) -> Void {
        let appleId = RCTConvert.nsString(options["appleId"])
        if appleId == "" {
            return
        }
        let str = "itms-apps://itunes.apple.com/app/id\(appleId!)"
        guard let url = URL(string: str) else { return }
        DispatchQueue.main.async {
            let can = UIApplication.shared.canOpenURL(url)
            if can {
                if #available(iOS 10.0, *) {
                    UIApplication.shared.open(url, options: [:]) { (b) in
                        print("打开结果: \(b)")
                    }
                } else {
                    //iOS 10 以前
                    UIApplication.shared.openURL(url)
                }
            } else {
                
            }
        }
    }
}
