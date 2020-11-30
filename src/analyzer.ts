import cheerio from 'cheerio';
import fs from 'fs';
import {AnalyzerType } from './crowller';
interface Course {
    title: string;
    count: number;
}
interface CourseResult {
    time: number;
    data: Course[];
}
interface Content {
    [propName: number]: Course[]
}

export default class Analyzer implements AnalyzerType {
    private static  instance: Analyzer;
    static getInstance() {
        if(!this.instance) {
            Analyzer.instance = new Analyzer();
        }
        return Analyzer.instance;
    }
    private getCourseInfo(html: string) {
        const $ = cheerio.load(html);
        const courseItem = $('.course-item');
        const courseInfos: Course[] = [];
        courseItem.map((index, element) => {
            const descs = $(element).find('.course-desc');
            const title = descs.eq(0).text();
            const count = parseInt(descs.eq(1).text().split('：')[1],10);
            courseInfos.push({title,count});
        });
        return {
            time: new Date().getTime(),
            data: courseInfos
        };
    }
    private generateJsonContent(courseInfos: CourseResult,filePath: string) {
        let fileContent: Content = {};
        if(fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath,'utf-8'));
        } 
        fileContent[courseInfos.time] = courseInfos.data;
        return fileContent;
        
    }

    public analyze(html: string, filePath: string) {
        const courseInfos = this.getCourseInfo(html);
        const fileContent = this.generateJsonContent(courseInfos,filePath);
        return JSON.stringify(fileContent);
    }

    private constructor() {}
}