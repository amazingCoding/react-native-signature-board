//
//  RNSignatureBoardView.m
//  reactCode
//
//  Created by 宋航 on 2021/2/22.
//

#import "RNSignatureBoardView.h"

@interface RNSignatureBoardView()
@property (nonatomic,assign)CGPoint startingPoint;
@property (nonatomic,strong)UIBezierPath *path;
@property (nonatomic,strong)RCTEventDispatcher *eventDispatcher;

@end
@implementation RNSignatureBoardView

- (instancetype)init{
  self = [super init];
  if (self) {
    [self setClipsToBounds:YES];
    [self setMultipleTouchEnabled:NO];
  }
  return self;
}
- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher{
  self = [super init];
  if (self) {
    [self setClipsToBounds:YES];
    [self setMultipleTouchEnabled:NO];
    self.eventDispatcher = eventDispatcher;
  }
  return self;
}
- (void)removeFromSuperview{
  _eventDispatcher = nil;
  [super removeFromSuperview];
}
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
  if(touches.count > 0){
    _startingPoint = [[touches anyObject] locationInView:self];
  }
  
}
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
  CGPoint touchPoint = [[touches anyObject] locationInView:self];
  _path = [[UIBezierPath alloc] init];
  [_path moveToPoint:_startingPoint];
  [_path addLineToPoint:touchPoint];
  _startingPoint = touchPoint;
  [self draw];
}
-(void)draw{
  CAShapeLayer *layer = [[CAShapeLayer alloc] init];
  layer.lineCap = kCALineCapRound;
  layer.lineJoin = kCALineJoinRound;
  [layer setPath:_path.CGPath];
  if(_lineColor) {
    [layer setStrokeColor:[self colorWithHexString:_lineColor].CGColor];
    [layer setFillColor:[self colorWithHexString:_lineColor].CGColor];
  }
  else{
    [layer setStrokeColor:UIColor.blackColor.CGColor];
    [layer setFillColor:UIColor.blackColor.CGColor];
  }
  
  if(self.lineWidth > 0) [layer setLineWidth:[self.lineWidth doubleValue]];
  else [layer setLineWidth:1.0];
  [self.layer addSublayer:layer];
  [self setNeedsDisplay];
}
-(void)clear{
  if(_path) [_path removeAllPoints];
  self.layer.sublayers = nil;
  [self setNeedsDisplay];
}
- (void)getImage:(BOOL)opaque {
  if(!opaque) self.layer.backgroundColor = UIColor.clearColor.CGColor;
  UIGraphicsBeginImageContextWithOptions(self.bounds.size, opaque, [UIScreen mainScreen].scale);
  [self.layer renderInContext:UIGraphicsGetCurrentContext()];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  NSString *base64Str = [UIImagePNGRepresentation(image) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
  if(self.onImageFinish){
    self.onImageFinish(@{@"res":base64Str});
  }
  if(!opaque) self.layer.backgroundColor = [self colorWithHexString:_bgColor].CGColor;
}
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{}
- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{}
- (void)setLineColor:(NSString *)lineColor{
  if (![lineColor isEqual:_lineColor]) {
    _lineColor = lineColor;
  }
}
- (void)setBgColor:(NSString *)bgColor{
  if (![bgColor isEqual:_bgColor]) {
    self.backgroundColor = [self colorWithHexString:bgColor];
    _bgColor = bgColor;
  }
}

- (void)setLineWidth:(NSNumber*)lineWidth{
  if (![lineWidth isEqual:_lineWidth]) {
    _lineWidth = lineWidth;
  }
}
- (UIColor *)colorWithHexString:(NSString *)stringToConvert{
    NSString *cString = [[stringToConvert stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] uppercaseString];
    
    if ([cString hasPrefix:@"#"])
        cString = [cString substringFromIndex:1];
    if ([cString length] != 6 && [cString length] != 3)
        return UIColor.whiteColor;
    
    unsigned int r, g, b;
    NSRange range;
    if([cString length] == 6){
      range.location = 0;
      range.length = 2;
      NSString *rString = [cString substringWithRange:range];
      range.location = 2;
      NSString *gString = [cString substringWithRange:range];
      range.location = 4;
      NSString *bString = [cString substringWithRange:range];
      [[NSScanner scannerWithString:rString] scanHexInt:&r];
      [[NSScanner scannerWithString:gString] scanHexInt:&g];
      [[NSScanner scannerWithString:bString] scanHexInt:&b];
    }
    else{
        range.location = 0;
        range.length = 1;
        NSString *rString = [cString substringWithRange:range];
        rString = [NSString stringWithFormat:@"%@%@",rString,rString];
      
        range.location = 1;
        NSString *gString = [cString substringWithRange:range];
        gString = [NSString stringWithFormat:@"%@%@",gString,gString];
        
        range.location = 2;
        NSString *bString = [cString substringWithRange:range];
        bString = [NSString stringWithFormat:@"%@%@",bString,bString];
        
        [[NSScanner scannerWithString:rString] scanHexInt:&r];
        [[NSScanner scannerWithString:gString] scanHexInt:&g];
        [[NSScanner scannerWithString:bString] scanHexInt:&b];
    }
    //SANLog(@"%u %u %u",r,g,b);
    return [UIColor colorWithRed:((float) r / 255.0f)
                           green:((float) g / 255.0f)
                            blue:((float) b / 255.0f)
                           alpha:1.0f];
}

@end
