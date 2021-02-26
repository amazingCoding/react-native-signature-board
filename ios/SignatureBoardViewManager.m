#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNSignatureBoardView.h"

@interface SignatureBoardViewManager : RCTViewManager
@end

@implementation SignatureBoardViewManager

RCT_EXPORT_MODULE(SignatureBoardView)

- (UIView *)view{
  return [[RNSignatureBoardView alloc] init];
}
RCT_EXPORT_VIEW_PROPERTY(bgColor,NSString);
RCT_EXPORT_VIEW_PROPERTY(lineColor,NSString);
RCT_EXPORT_VIEW_PROPERTY(lineWidth,NSNumber);
RCT_EXPORT_VIEW_PROPERTY(onImageFinish, RCTBubblingEventBlock)
RCT_EXPORT_METHOD(clear:(nonnull NSNumber*) reactTag) {
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,RNSignatureBoardView *> *viewRegistry) {
    RNSignatureBoardView *view = viewRegistry[reactTag];
      if (!view || ![view isKindOfClass:[RNSignatureBoardView class]]) {
          RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
      }
      [view clear];
  }];
}
RCT_EXPORT_METHOD(getImage:(nonnull NSNumber*) reactTag widthOpaque:(BOOL) opaque) {
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,RNSignatureBoardView *> *viewRegistry) {
    RNSignatureBoardView *view = viewRegistry[reactTag];
      if (!view || ![view isKindOfClass:[RNSignatureBoardView class]]) {
          RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
          return;
      }
    [view getImage:opaque];
  }];
}

@end
