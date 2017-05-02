/*
    A color-picker-component built from three sliders.
*/

import { Component, Output, Input, ViewChild, EventEmitter } from '@angular/core';

@Component({
    selector: 'color-picker',
    templateUrl: 'color-picker-sliders.html'
})
export class ColorPicker {

    @Input() color: string;

    @Output() colorChanged = new EventEmitter<String>();

    @ViewChild("redSlider") redSlider;
    @ViewChild("greenSlider") greenSlider;
    @ViewChild("blueSlider") blueSlider;

    public redComponent: number;
    public greenComponent: number;
    public blueComponent: number;

    public ngOnInit() {
        // console.log("ColorPicker().ngOnInit()");

        if (this.color) {
            this.colorToComponents(this.color);
        } else {
            this.colorToComponents("#2299ff");
        }
    }

    clampValue(val: number, min: number, max: number): number {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        } else {
            return val;
        }
    }

    // Expects a #rrggbb hex-string and splits it up
    // into the three components.
    // TODO: Add error-checking :-) 
    colorToComponents(color: string): void {
        // console.log("ColorPicker.colorToComponents(\"" + color + "\")");

        this.redComponent = this.clampValue(parseInt("0x" + color.substr(1, 2)), 0, 255);
        this.greenComponent = this.clampValue(parseInt("0x" + color.substr(3, 2)), 0, 255);
        this.blueComponent = this.clampValue(parseInt("0x" + color.substr(5, 2)), 0, 255);

        // console.log("ColorPicker.colorToComponents(\"" + this.componentsToColor() + "\")");
    }

    toHex(n) {
        if (isNaN(n)) return "00";
        return "0123456789abcdef".charAt((n - n % 16) / 16) + "0123456789abcdef".charAt(n % 16);
    }

    componentsToColor() {
        return "#" + this.toHex(this.redComponent) + this.toHex(this.greenComponent) + this.toHex(this.blueComponent);
    }

    emitColorChanged() {
        // console.log("ColorPicker.emitColorChanged(\"" + this.componentsToColor() + "\")");
        
        this.colorChanged.emit(this.componentsToColor());
    }

    componentChange() {
        // console.log("ColorPicker.componentChange()");
        this.emitColorChanged();
    }
}
