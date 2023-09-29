import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResourceSanitizerPipe } from '../pipes/resource-sanitizer.pipe';
import { TextShortnerPipe } from '../pipes/text-shortner.pipe';
import { InlineMatSpinnerComponent } from '../components/inline-mat-spinner/inline-mat-spinner.component';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { ConfirmYesNoComponent } from '../dialogs/confirm-yes-no/confirm-yes-no.component';
import { CurrencyDirective } from '../directives/currency.directive';
import { LowercaseDirective } from '../directives/lowercase.directive';
import { RemoveSpacesDirective } from '../directives/remove-spaces.directive';
import { TelephoneFormaterDirective } from '../directives/telephone-formater.directive';
import { UppercaseDirective } from '../directives/Uppercase.directive';
import { CheckAgainstMaxValueDirective } from '../directives/check-against-max-value.directive';
import { DigitCommaSeparatorDirective } from '../directives/digit-comma-separator.directive';
import { StatisticsCardComponent } from '../components/statistics-card/statistics-card.component';
import { TextHighlighterPipe } from '../pipes/text-highlighter.pipe';
import { PieChartComponent } from '../components/pie-chart/pie-chart.component';
import { BarGraphComponent } from '../components/bar-graph/bar-graph.component';

@NgModule({
    declarations: [
        ResourceSanitizerPipe,
        TextShortnerPipe,
        InlineMatSpinnerComponent,
        SnackbarComponent,
        BreadcrumbComponent,
        ConfirmYesNoComponent,
        CurrencyDirective,
        LowercaseDirective,
        RemoveSpacesDirective,
        TelephoneFormaterDirective,
        UppercaseDirective,
        DigitCommaSeparatorDirective,
        CheckAgainstMaxValueDirective,
        StatisticsCardComponent,
        TextHighlighterPipe,
        PieChartComponent,
        BarGraphComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        ResourceSanitizerPipe,
        TextShortnerPipe,
        InlineMatSpinnerComponent,
        BreadcrumbComponent,
        CurrencyDirective,
        LowercaseDirective,
        RemoveSpacesDirective,
        TelephoneFormaterDirective,
        UppercaseDirective,
        DigitCommaSeparatorDirective,
        CheckAgainstMaxValueDirective,
        StatisticsCardComponent,
        TextHighlighterPipe,
        PieChartComponent,
        BarGraphComponent,
    ],
    entryComponents: [
        SnackbarComponent,
        ConfirmYesNoComponent,
    ],
    providers: [
        ResourceSanitizerPipe,
        CurrencyPipe,
    ]
})
export class SharedModule {}
