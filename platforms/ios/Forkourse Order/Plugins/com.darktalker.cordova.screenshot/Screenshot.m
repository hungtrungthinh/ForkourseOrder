//
// Screenshot.h
//
// Created by Simon Madine on 29/04/2010.
// Copyright 2010 The Angry Robot Zombie Factory.
// - Converted to Cordova 1.6.1 by Josemando Sobral.
// MIT licensed
//
// Modifications to support orientation change by @ffd8
//

#define IS_RETINA ([[UIScreen mainScreen] respondsToSelector:@selector(displayLinkWithTarget:selector:)] && ([UIScreen mainScreen].scale == 2.0))

#import <Cordova/CDV.h>
#import "AppDelegate.h"

#import "Screenshot.h"

#import "PrinterFunctions.h"

@implementation Screenshot

@synthesize webView;

- (UIImage *)getScreenshot:(float)h
{
	UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
	CGRect rect = [keyWindow bounds];
    CGRect realRect = CGRectMake(0, 0, 300, h);
	UIGraphicsBeginImageContextWithOptions(realRect.size, YES, 0);
	[keyWindow drawViewHierarchyInRect:keyWindow.bounds afterScreenUpdates:YES];
	UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();
	return img;
}

- (UIImage*)webviewToImage
{
    NSURL *currentURL = [[webView request] URL];
    NSLog(@"%@",[currentURL description]);
    
    [webView.scrollView setContentOffset:CGPointMake(0, 0)];

    int currentWebViewHeight = webView.scrollView.contentSize.height;
    int scrollByY = webView.frame.size.height;
    
    
    NSMutableArray* images = [[NSMutableArray alloc] init];
    
    CGRect screenRect = webView.frame;
    screenRect.size.width = 300;
    int pages = currentWebViewHeight/scrollByY;
    if (currentWebViewHeight%scrollByY > 0) {
        pages ++;
    }
    
    for (int i = 0; i< pages; i++)
    {
        if (i == pages-1) {
            if (pages>1)
                screenRect.size.height = currentWebViewHeight - scrollByY;
            
        }
        
        if (IS_RETINA)
            UIGraphicsBeginImageContextWithOptions(screenRect.size, NO, 0);
        else
            UIGraphicsBeginImageContext( screenRect.size );
        if ([webView.layer respondsToSelector:@selector(setContentsScale:)]) {
            webView.layer.contentsScale = [[UIScreen mainScreen] scale];
        }
        //UIGraphicsBeginImageContext(screenRect.size);
        CGContextRef ctx = UIGraphicsGetCurrentContext();
        [[UIColor blackColor] set];
        CGContextFillRect(ctx, screenRect);
        
        [webView.layer renderInContext:ctx];
        
        UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        
        if (i == 0)
        {
            scrollByY = webView.frame.size.height;
        }
        else
        {
            scrollByY += webView.frame.size.height;
        }
        [webView.scrollView setContentOffset:CGPointMake(0, scrollByY)];
        [images addObject:newImage];
    }
    
    [webView.scrollView setContentOffset:CGPointMake(0, 0)];
    
    UIImage *resultImage;
    
    if(images.count > 1) {
        //join all images together..
        CGSize size;
        for(int i=0;i<images.count;i++) {
            
            size.width = MAX(size.width, ((UIImage*)[images objectAtIndex:i]).size.width );
            size.height += ((UIImage*)[images objectAtIndex:i]).size.height;
        }
        
        if (IS_RETINA)
            UIGraphicsBeginImageContextWithOptions(size, NO, 0);
        else
            UIGraphicsBeginImageContext(size);
        if ([webView.layer respondsToSelector:@selector(setContentsScale:)]) {
            webView.layer.contentsScale = [[UIScreen mainScreen] scale];
        }
        CGContextRef ctx = UIGraphicsGetCurrentContext();
        [[UIColor blackColor] set];
        CGContextFillRect(ctx, screenRect);
        
        int y=0;
        for(int i=0;i<images.count;i++) {
            
            UIImage* img = [images objectAtIndex:i];
            [img drawAtPoint:CGPointMake(0,y)];
            y += img.size.height;
        }
        
        resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    } else {
        
        resultImage = [images objectAtIndex:0];
    }
    [images removeAllObjects];
    return resultImage;
}

- (void)saveScreenshot:(CDVInvokedUrlCommand*)command
{    
    NSNumber *quality = command.arguments[1];
    float height = [quality floatValue];
    NSString *portName = [AppDelegate getPortName];
    NSString *portSettings = [AppDelegate getPortSettings];
    
    UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    CGRect rect = [keyWindow bounds];
    
    int width = 576;
    NSLog(@"width: %f", rect.size.width);
    
	NSString *filename = [command.arguments objectAtIndex:2];
	//NSNumber *quality = [command.arguments objectAtIndex:1];

	NSString *path = [NSString stringWithFormat:@"%@.png",filename];
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *basePath = paths.firstObject;
    
	NSString *jpgPath = [basePath stringByAppendingPathComponent:path];

    UIImage *image = [self getScreenshot:height];
    //[self webviewToImage:self.webView];
    //UIImage *thumb = [self thumbImage:image];
    
    [PrinterFunctions PrintImageWithPortname:portName
                                portSettings:portSettings
                                imageToPrint:image
                                    maxWidth:width compressionEnable:YES
                              withDrawerKick:NO];
    
	//NSData *imageData = UIImageJPEGRepresentation(image,[quality floatValue]);
    NSData *imageData = UIImagePNGRepresentation(image);
	[imageData writeToFile:jpgPath atomically:NO];

    /*UIDeviceOrientation orientation = [AppDelegate getOrientation];
    
    NSNumber *value = [NSNumber numberWithInt:orientation];
    [[UIDevice currentDevice] setValue:value forKey:@"orientation"];*/
    
	CDVPluginResult* pluginResult = nil;
	NSDictionary *jsonObj = [ [NSDictionary alloc]
		initWithObjectsAndKeys :
		jpgPath, @"filePath",
		@"true", @"success",
		nil
	];

	pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
	NSString* callbackId = command.callbackId;
	[self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
}

- (void) getScreenshotAsURI:(CDVInvokedUrlCommand*)command
{
	NSNumber *quality = command.arguments[1];
    UIImage *image = [self getScreenshot:[quality floatValue]];
	NSData *imageData = UIImageJPEGRepresentation(image,[quality floatValue]);
	NSString *base64Encoded = [imageData base64EncodedStringWithOptions:0];
	NSDictionary *jsonObj = @{
	    @"URI" : [NSString stringWithFormat:@"data:image/jpeg;base64,%@", base64Encoded]
	};
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:[command callbackId]];
}
@end
