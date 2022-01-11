import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from "@angular/material/divider"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatRadioModule } from "@angular/material/radio"
import { MatTabsModule } from "@angular/material/tabs"
import { MatToolbarModule } from "@angular/material/toolbar"
import { QRCodeModule } from "dist/angularx-qrcode"
import { AppComponent } from "./app.component"

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    MatToolbarModule,
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
