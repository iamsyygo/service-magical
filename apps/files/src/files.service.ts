import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
@Injectable()
export class FilesService {
  getHello(): string {
    return 'Hello World!';
  }

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

    const test = result.splice(20, 4);

    const html = test.reduce((acc, cur) => {
      return acc
        .then((html) => {
          console.log(html);

          return page.goto(cur.href);
        })
        .then(() => {
          return page.content();
        });
    }, Promise.resolve(''));
  }
}
