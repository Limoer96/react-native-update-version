#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(UpdateVersion, NSObject)

RCT_EXTERN_METHOD(updateIOS:(NSDictionary *)options)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
