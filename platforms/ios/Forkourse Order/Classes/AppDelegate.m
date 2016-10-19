/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  Forkourse Order
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

#import <Cordova/CDVPlugin.h>
#import "IOS_SDKViewControllerRasterMode.h"

static NSString *portName = nil;
static NSString *portSettings = nil;
static NSString *drawerPortName = nil;
static UIDeviceOrientation pOrientation;

@implementation AppDelegate

@synthesize window, viewController;
#pragma mark getter/setter

- (void)printSettingController
{
    IOS_SDKViewControllerRasterMode *viewController1 = [[[IOS_SDKViewControllerRasterMode alloc] initWithNibName:@"IOS_SDKViewControllerRasterMode" bundle:nil] autorelease];
    [self.viewController presentViewController:viewController1 animated:YES completion:nil];
}

+ (UIDeviceOrientation)getOrientation
{
    return pOrientation;
}

+ (void)setOrientation:(UIDeviceOrientation)orientation
{
    pOrientation = orientation;
}

+ (NSString*)getPortName
{
    return portName;
}

+ (void)setPortName:(NSString *)m_portName
{
    if (portName != m_portName) {
        [portName release];
        portName = [m_portName copy];
    }
}

+ (NSString *)getPortSettings
{
    return portSettings;
}

+ (void)setPortSettings:(NSString *)m_portSettings
{
    if (portSettings != m_portSettings) {
        [portSettings release];
        portSettings = [m_portSettings copy];
    }
}

+ (NSString *)getDrawerPortName {
    return drawerPortName;
}

+ (void)setDrawerPortName:(NSString *)portName {
    if (drawerPortName != portName) {
        [drawerPortName release];
        drawerPortName = [portName copy];
    }
}

- (id)init
{
    /** If you need to do any extra app-specific initialization, you can do it here
     *  -jm
     **/
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];

    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];

    int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
    int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
#if __has_feature(objc_arc)
        NSURLCache* sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"];
#else
        NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
#endif
    [NSURLCache setSharedURLCache:sharedCache];

    self = [super init];
    return self;
}

#pragma mark UIApplicationDelegate implementation

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    CGRect screenBounds = [[UIScreen mainScreen] bounds];

#if __has_feature(objc_arc)
        self.window = [[UIWindow alloc] initWithFrame:screenBounds];
#else
        self.window = [[[UIWindow alloc] initWithFrame:screenBounds] autorelease];
#endif
    self.window.autoresizesSubviews = YES;

#if __has_feature(objc_arc)
        self.viewController = [[MainViewController alloc] init];
#else
        self.viewController = [[[MainViewController alloc] init] autorelease];
#endif

    // Set your app's start page by setting the <content src='foo.html' /> tag in config.xml.
    // If necessary, uncomment the line below to override it.
    // self.viewController.startPage = @"index.html";

    // NOTE: To customize the view's frame size (which defaults to full screen), override
    // [self.viewController viewWillAppear:] in your view controller.

    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];

    return YES;
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if Forkourse Order-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
{
    if (!url) {
        return NO;
    }

    // all plugins will get the notification, and their handlers will be called
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];

    return YES;
}

// repost all remote and local notification using the default NSNotificationCenter so multiple plugins may respond
- (void)            application:(UIApplication*)application
    didReceiveLocalNotification:(UILocalNotification*)notification
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVLocalNotification object:notification];
}

#ifndef DISABLE_PUSH_NOTIFICATIONS

    - (void)                                 application:(UIApplication*)application
        didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
    {
        // re-post ( broadcast )
        NSString* token = [[[[deviceToken description]
            stringByReplacingOccurrencesOfString:@"<" withString:@""]
            stringByReplacingOccurrencesOfString:@">" withString:@""]
            stringByReplacingOccurrencesOfString:@" " withString:@""];

        [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
    }

    - (void)                                 application:(UIApplication*)application
        didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
    {
        // re-post ( broadcast )
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotificationError object:error];
    }
#endif

- (NSUInteger)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
{
    // iPhone doesn't support upside down by default, while the iPad does.  Override to allow all orientations always, and let the root view controller decide what's allowed (the supported orientations mask gets intersected).
    NSUInteger supportedInterfaceOrientations = (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationLandscapeLeft) | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationPortraitUpsideDown);

    return supportedInterfaceOrientations;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}

+ (void)setButtonArrayAsOldStyle:(NSArray *)buttons {
    for (id object in buttons) {
        if ([object isKindOfClass:[UIButton class]] == NO) {
            continue;
        }
        
        UIButton *button = (UIButton *)object;
        button.layer.backgroundColor = [[UIColor whiteColor] CGColor];
        button.layer.borderColor = [[UIColor grayColor] CGColor];
        button.layer.borderWidth = 1.0;
        button.layer.cornerRadius = 10.0;
        button.clipsToBounds = YES;
    }
}

+ (SMPrinterType)parsePortSettings:(NSString *)portSettings {
    if (portSettings == nil) {
        return SMPrinterTypeDesktopPrinterStarLine;
    }
    
    NSArray *params = [portSettings componentsSeparatedByString:@";"];
    
    BOOL isESCPOSMode = NO;
    BOOL isPortablePrinter = NO;
    
    for (NSString *param in params) {
        NSString *str = [param stringByTrimmingCharactersInSet:NSCharacterSet.whitespaceAndNewlineCharacterSet];
        
        if ([str caseInsensitiveCompare:@"mini"] == NSOrderedSame) {
            return SMPrinterTypePortablePrinterESCPOS;
        }
        
        if ([str caseInsensitiveCompare:@"Portable"] == NSOrderedSame) {
            isPortablePrinter = YES;
            continue;
        }
        
        if ([str caseInsensitiveCompare:@"escpos"] == NSOrderedSame) {
            isESCPOSMode = YES;
            continue;
        }
    }
    
    if (isPortablePrinter) {
        if (isESCPOSMode) {
            return SMPrinterTypePortablePrinterESCPOS;
        } else {
            return SMPrinterTypePortablePrinterStarLine;
        }
    }
    
    return SMPrinterTypeDesktopPrinterStarLine;
}

#pragma mark Help

+ (NSString *)HTMLCSS
{
    NSString *cssDefninition = @"<html>\
    <head>\
    <style type=\"text/css\">\
    Code {color:blue;}\n\
    CodeDef {color:blue;font-weight:bold}\n\
    TitleBold {font-weight:bold}\n\
    It1 {font-style:italic; font-size:12}\n\
    LargeTitle{font-size:20px}\n\
    SectionHeader{font-size:17;font-weight:bold}\n\
    UnderlineTitle {text-decoration:underline}\n\
    div_cutParam {position:absolute; top:100; left:30; width:200px;font-style:italic;}\n\
    div_cutParam0 {position:absolute; top:130; left:30; font-style:italic;}\n\
    div_cutParam1 {position:absolute; top:145; left:30; font-style:italic;}\n\
    div_cutParam2 {position:absolute; top:160; left:30; font-style:italic;}\n\
    div_cutParam3 {position:absolute; top:175; left:30; font-style:italic;}\n\
    .div-tableBarcodeWidth{display:table;}\n\
    .div-table-rowBarcodeWidth{display:table-row;}\n\
    .div-table-colBarcodeWidthHeader{display:table-cell;border:1px solid #000000;background: #800000;color:#ffffff}\n\
    .div-table-colBarcodeWidthHeader2{display:table-cell;border:1px solid #000000;background: #800000;color:#ffffff}\n\
    .div-table-colBarcodeWidth{display:table-cell;border:1px solid #000000;}\n\
    rightMov {position:absolute; left:30px; font-style:italic;}\n\
    rightMov_NOI {position:absolute; left:55px;}\n\
    rightMov_NOI2 {position:absolute; left:90px;}\n\
    StandardItalic {font-style:italic}\
    .div-tableCut{display:table;}\n\
    .div-table-rowCut{display:table-row;}\n\
    .div-table-colFirstCut{display:table-cell;width:40px}\n\
    .div-table-colCut{display:table-cell;}\n\
    .div-table-colRaster{display:table-cell; border:1px solid #000000;}\n\
    </style>\
    </head>";
    
    return cssDefninition;
}
@end
