import { IconsModule } from '@/app/shared/components/icons';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [IconsModule, RouterLink, CommonModule],
  templateUrl: './landing.html',
})
export class Landing {
  openIndex: number | null = null; // first one open by default

  faqs = [
    {
      question: 'Why should podcasters use Linktree?',
      answer: `Right now, every time you’ve got something new to share, you have to go to every single one of your channels to change the link in each of your bios. It’s time-consuming and complicated — making it so much harder to keep everything up to date.

A link in bio tool means you never have to compromise, or remove one link from your bio so you can add another. You can keep everything you want to share online in one link. When you’ve got a change, you only ever have to make it once.`,
    },
    {
      question: 'Is Linktree the original link in bio tool?',
      answer: `The short answer? Yes!

Back in 2016, we created Linktree as an easy way to link out to all socials and unify digital ecosystems, pioneering the link-in-bio category. Linktree remains the leading, biggest and most popular link-in-bio solution – but that’s just the beginning.  You can use your Linktree URL or QR code anywhere your audience is, including on your business cards, in your email signature, on paper-based posters and brochures, and even on your resumé. If you don’t have a website, that’s fine. If you have a Linktree, you don’t need one!`,
    },
    {
      question: 'Can you get paid and sell things from a Linktree?',
      answer: `Yes, you can! We offer plenty of ways to sell products and monetize your audience. You can collect revenue from affiliate links, and sell your products right in your Linktree. Monetisation features are only available for selected countries, see this Help Article for more.

A lot of Linktree creators see incredible results with online sales on Linktree, because it removes the extra steps involved in a purchase.

‍“We love how Linktree has helped us manage our business by having all social media and ways to pay in one location. The QR code has made it easy for customers to access it all!” – Tiffany`,
    },
    {
      question: 'Is Linktree safe to use on all of my social media profiles?',
      answer: `Linktree is trusted by all social platforms, and is even used on many of Facebook, Instagram and TikTok’s own social media accounts! Because Linktree is the original and most popular link-in-bio tool, the linktr.ee URL is a trusted, identifiable and familiar link that audiences feel comfy and safe clicking on.`,
    },
    {
      question: 'How many links should I have on my Linktree?',
      answer: `This depends on two things. If your priority is click-throughs and conversion, we recommend having 3-7 links on your Linktree at once (based on our most successful creators). Including too many options for your visitors slows down their course of action.

That said: for certain creators whose priority is display, education and showcasing (e.g. a record label with a library of new releases to promote, or a management company looking to showcase their full roster of clients), including more than seven links fulfils their purpose perfectly.

You can use features on Linktree to add subheadings, sections, animation and other prioritisation methods to your links – so no matter how many things you’ve got to share, you can drive your visitors to what’s most important, first.`,
    },
  ];

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
