﻿//
//  code39.m
//  IOS_SDK
//
//  Created by Tzvi on 8/2/11.
//  Copyright 2011 - 2013 STAR MICRONICS CO., LTD. All rights reserved.
//

#import "AppDelegate.h"

#import "code39.h"
#import <QuartzCore/QuartzCore.h>
#import "StandardHelp.h"

#import "PrinterFunctions.h"

#import "AbstractActionSheetPicker.h"
#import "ActionSheetStringPicker.h"

#define kOFFSET_FOR_KEYBOARD 150.0

@implementation code39

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        array_width = [[NSArray alloc] initWithObjects:@"2:6", @"3:9", @"4:12", @"2:5", @"3:8", @"4:10", @"2:4", @"3:6", @"4:8", nil];
        array_layout = [[NSArray alloc] initWithObjects:@"No under-bar char + line feed",
                        @"Add under-bar char + line feed",
                        @"No under-bar char + no line feed",
                        @"Add under-bar char + no line feed", nil];
    }
    
    return self;
}

- (void)dealloc
{
    [uiview_block release];
    
    [uiimageview_barcode release];
    
    [uitextfield_height release];
    [uitextfield_data release];
    
    [buttonWidth release];
    [buttonLayout release];
    
    [array_width release];
    [array_layout release];
    
    [buttonBack release];
    [buttonHelp release];
    [buttonPrint release];
    [super dealloc];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];

    uiimageview_barcode.image = [UIImage imageNamed:@"code39.gif"];

    uitextfield_data.delegate = self;
    uitextfield_height.delegate = self;

    selectedWidth  = 0;
    selectedLayout = 0;

    [buttonWidth  setTitle:array_width [selectedWidth]  forState:UIControlStateNormal];
    [buttonLayout setTitle:array_layout[selectedLayout] forState:UIControlStateNormal];
    
    [AppDelegate setButtonArrayAsOldStyle:@[buttonBack, buttonHelp, buttonLayout, buttonPrint, buttonWidth]];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

- (IBAction)backCode39
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (IBAction)selectWidth:(id)sender
{
    ActionStringDoneBlock done = ^(ActionSheetStringPicker *picker, NSInteger selectedIndex, id selectedValue)
    {
        selectedWidth = selectedIndex;

        [buttonWidth setTitle:selectedValue forState:UIControlStateNormal];
    };

    ActionStringCancelBlock cancel = ^(ActionSheetStringPicker *picker)
    {
    };

    [ActionSheetStringPicker showPickerWithTitle:@"Select Width" rows:array_width initialSelection:selectedWidth doneBlock:done cancelBlock:cancel origin:sender];
}

- (IBAction)selectLayout:(id)sender
{
    ActionStringDoneBlock done = ^(ActionSheetStringPicker *picker, NSInteger selectedIndex, id selectedValue)
    {
        selectedLayout = selectedIndex;

        [buttonLayout setTitle:selectedValue forState:UIControlStateNormal];
    };

    ActionStringCancelBlock cancel = ^(ActionSheetStringPicker *picker)
    {
    };

    [ActionSheetStringPicker showPickerWithTitle:@"Select Layout" rows:array_layout initialSelection:selectedLayout doneBlock:done cancelBlock:cancel origin:sender];
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{    
    if ([string isEqualToString:@"\n"] == YES)
    {
        [uitextfield_data resignFirstResponder];
        [uitextfield_height resignFirstResponder];
        return NO;
    }
    
    if (uitextfield_data == textField)
    {
        return YES;
    }
    
    if ([string length] == 0)
    {
        return YES;
    }
    
    if (([string characterAtIndex:0] >= '0') && ([string characterAtIndex:0] <= '9'))
    {
        return YES;
    }
    
    return NO;
}

- (IBAction)showHelp
{
    NSString *title = @"Code 39 Barcode";
    NSString *helpText = [AppDelegate HTMLCSS];
    
    helpText = [helpText stringByAppendingFormat:@"<body>\
                <Code>ASCII:</Code> \
                <CodeDef>ESC b EOT <StandardItalic>n2 n3 n4 d1 ... dk</StandardItalic> RS</CodeDef></br>\
                <Code>Hex:</Code> <CodeDef>1B 62 04 <StandardItalic>n2 n3 n4 d1 ... dk</StandardItalic> 1E</CodeDef><br/><br/>\
                <TitleBold>Code 39</TitleBold> represents numbers 0 to 9 and the letters of the alphabet from A to Z.  \
                These are the symbols most frequently used today in industry.\
                </body></html>"];
    
    StandardHelp *helpVar = [[StandardHelp alloc] initWithNibName:@"StandardHelp" bundle:[NSBundle mainBundle]];
    [self presentViewController:helpVar animated:YES completion:nil];
    [helpVar release];
    
    [helpVar setHelpTitle:title];
    [helpVar setHelpText:helpText];
}

- (void)printBarCode
{
    [self.view bringSubviewToFront:uiview_block];
    
    NSString *portName = [AppDelegate getPortName];
    NSString *portSettings = [AppDelegate getPortSettings];

    NSData *barcodeData = [uitextfield_data.text dataUsingEncoding:NSWindowsCP1252StringEncoding];

    unsigned char *barcodeBytes = (unsigned char *)malloc(barcodeData.length);
    [barcodeData getBytes:barcodeBytes length:barcodeData.length];
    
    int height = uitextfield_height.text.intValue;

    NarrowWide     width  = (NarrowWide)selectedWidth;
    BarCodeOptions layout = (BarCodeOptions)selectedLayout;

    [PrinterFunctions PrintCode39WithPortname:portName
                                 portSettings:portSettings
                                  barcodeData:barcodeBytes
                              barcodeDataSize:(unsigned int)barcodeData.length
                               barcodeOptions:layout
                                       height:height
                                   narrowWide:width];

    free(barcodeBytes);
    
    [self.view sendSubviewToBack:uiview_block];
}

@end
