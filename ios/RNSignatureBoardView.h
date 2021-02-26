//
//  RNSignatureBoardView.h
//  reactCode
//
//  Created by 宋航 on 2021/2/22.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSignatureBoardView : UIView
@property (nonatomic, assign) NSString *bgColor;
@property (nonatomic, assign) NSString *lineColor;
@property (nonatomic,assign) NSNumber *lineWidth;
@property (nonatomic,copy) RCTBubblingEventBlock onImageFinish;
- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher;
-(void)clear;
- (void)getImage:(BOOL)opaque;
@end

NS_ASSUME_NONNULL_END
