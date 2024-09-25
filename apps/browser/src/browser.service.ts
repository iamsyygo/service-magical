import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
@Injectable()
export class BrowserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async uploadFile(file: Express.Multer.File) {
    const $ = load(file.buffer.toString('utf-8'));

    // 获取所有 a 标签
    const aTags = $('a');

    interface IResult {
      href: string;
      icon: string;
      add_date: string;
      content: string;
    }

    const result: IResult[] = [];
    aTags.each((index, element) => {
      const href = $(element).attr('href');
      const icon = $(element).attr('icon');
      const add_date = $(element).attr('add_date');
      const content = $(element).text();
      result.push({
        href,
        icon,
        add_date,
        content,
      });
    });

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 0,
        height: 0,
      },
    });
    const page = await browser.newPage();
    const test = result.splice(20, 50);

    for await (const element of test) {
      try {
        await page.goto(element.href);
        const htmlHandle = await page.$('html');
        const htmlString = await page.content();
        const originTitle = await page.title();
        const html = await page.evaluate((html) => {
          return html.innerText;
        }, htmlHandle);
        await htmlHandle.dispose();

        await this.prismaService.bookmarksVault.create({
          data: {
            url: element.href,
            title: element.content,
            addDate: Number(element.add_date),
            icon: element.icon,
            html: htmlString,
            isHandled: true,
            originTitle: originTitle,
            text: html,
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.log('error', error);
        await this.prismaService.bookmarksVault.create({
          data: {
            url: element.href,
            title: element.content,
            addDate: Number(element.add_date),
            icon: element.icon,
            isHandled: false,
          },
        });
      }
    }
  }
}
