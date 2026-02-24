import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  Cannabis,
  Link,
  Pencil,
  ChartLine,
  CircleUserRound,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Facebook,
  Slack,
  Youtube,
  Mail,
  Twitch,
  Plus,
  Cross,
  X,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      // Add icons here
      Cannabis,
      Link,
      Pencil,
      ChartLine,
      CircleUserRound,
      Instagram,
      Linkedin,
      Twitter,
      Github,
      Facebook,
      Slack,
      Youtube,
      Mail,
      Twitch,
      Plus,
      X,
    }),
  ],

  exports: [LucideAngularModule],
})
export class IconsModule {}
