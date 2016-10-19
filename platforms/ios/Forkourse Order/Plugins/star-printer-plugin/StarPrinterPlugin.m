//
//  BrotherPrinterPlugin.m
//  BrotherPrinterPlugin
//
//  Created by Ye Star on 4/9/16.
//
//

#define PRINTER_TESTER 0

#import "StarPrinterPlugin.h"
#import "AppDelegate.h"
#import "PrinterFunctions.h"

#import <Cordova/CDVAvailability.h>
#import "IOS_SDKViewControllerLineMode.h"
#import "IOS_SDKViewControllerRasterMode.h"

#import "code39.h"

@interface StarPrinterPlugin ()

@property (retain) NSString* callbackId;

@end

@implementation StarPrinterPlugin
{
    UIActivityIndicatorView	*_indicator;
    UIView *_loadingView;
}

- (void) initWithUserDefault
{
    // "UserDefault" Initialize
    NSUserDefaults *userDefaults    = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *defaults   = [NSMutableDictionary dictionary];
    
    [defaults setObject:@""                                                 forKey:@"key"];
    
    [userDefaults registerDefaults:defaults];
}

/*
 *  pluginInitialize
 */
- (void)pluginInitialize
{
    NSLog(@"pluginInitialize");
    
    [self initWithUserDefault];
    
}

- (void)onAppTerminate
{
    //[self removeNotificationObserver];
}

/*
 *  Return printer list
 *
 * @param {Function} callback
 *      A callback function to be called with the result
 */
- (void)setting:(CDVInvokedUrlCommand*)command
{
    _callbackId = command.callbackId;
    IOS_SDKViewControllerRasterMode *viewController = [[[IOS_SDKViewControllerRasterMode alloc] initWithNibName:@"IOS_SDKViewControllerRasterMode" bundle:nil] autorelease];
    [self.viewController presentViewController:viewController animated:YES completion:nil];
}

/*
 *  Return printer list
 *
 * @param {Function} callback
 *      A callback function to be called with the result
 */
- (void)preSetting:(CDVInvokedUrlCommand*)command
{
    /*UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    [AppDelegate setOrientation:orientation];

    if(orientation == UIDeviceOrientationLandscapeLeft || orientation == UIDeviceOrientationLandscapeRight)
    {
        NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
        [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
    }
    _callbackId = command.callbackId;
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OK"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_callbackId];*/
}

/*
 * Print
 *
 * @param {Function} callback
 *      A callback function to be called with the result
 */
- (void)printView:(CDVInvokedUrlCommand*)command
{
    _callbackId = command.callbackId;
    
    /*NSDictionary *message = @{
                              @"Return_Type":@"Finished",
                              @"Wifi":@"1",
                              @"Bluetooth":@"0",
                              @"Status":@"OK"
                              };
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_callbackId];*/
    code39 *code39var = [[code39 alloc] initWithNibName:@"code39" bundle:[NSBundle mainBundle]];
    [self.viewController presentViewController:code39var animated:YES completion:nil];
}

- (void)print:(CDVInvokedUrlCommand*)command
{
    NSString *portName = [AppDelegate getPortName];
    NSString *portSettings = [AppDelegate getPortSettings];
    
    UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    CGRect rect = [keyWindow bounds];
    
    int width = rect.size.width;
    
    NSString *path = [NSString stringWithFormat:@"%@.jpg",@"preview"];
    NSString *jpgPath = [NSTemporaryDirectory() stringByAppendingPathComponent:path];
    
    NSData *imageData = [NSData dataWithContentsOfFile:jpgPath];
    UIImage *image = [UIImage imageWithData:imageData];
    
    [PrinterFunctions PrintImageWithPortname:portName
                                portSettings:portSettings
                                imageToPrint:image
                                    maxWidth:width compressionEnable:NO
                              withDrawerKick:NO];
}

/*
 * Print
 *
 * @param {Function} callback
 *      A callback function to be called with the result
 */
- (void)cancelPrint:(CDVInvokedUrlCommand *)command
{
    NSLog(@"*** Cancel Print ***");
    //[_ptp cancelPrinting];
    //[self removeNotificationObserver];
}

@end
