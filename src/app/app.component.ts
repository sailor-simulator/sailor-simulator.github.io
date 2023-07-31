import { Component, OnInit } from '@angular/core';
import { Languages, LanguagesEnum } from './data/languages.enum';
import { ITestSettings } from './interfaces/test-settings.interface';
import { QuestionsEnum } from './data/questions.enum';
import { IQuestion } from './interfaces/question.interface';
import { ArrayService } from './services/array.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  selectedLanguage: LanguagesEnum = LanguagesEnum.BY;
  isQuestionsRandom: boolean;
  isAnswerVariantsRandom: boolean;
  hasTestStarted = false;
  hasTestFinished = false;
  maximumErrorsQty = 10;
  questions: IQuestion[];
  unPassedQuestions: IQuestion[] = [];
  isLoading: boolean;
  languageTabs = Languages;
  theme = 'light';

  constructor(private arrayService: ArrayService) {}

  ngOnInit(): void {
    this.questions = JSON.parse(JSON.stringify(QuestionsEnum));
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', this.selectedLanguage);
    } else {
      this.selectedLanguage = (localStorage.getItem('lang') as LanguagesEnum);
    }
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    } else {
      this.theme = (localStorage.getItem('theme'));
    }
  }

  startTest(testSettings: ITestSettings): void {
    this.isQuestionsRandom = testSettings.isQuestionsRandom;
    this.isAnswerVariantsRandom = testSettings.isAnswerVariantsRandom;
    this.hasTestStarted = true;
    if (this.isQuestionsRandom) {
      this.questions = this.arrayService.shuffleArray(this.questions);
    } else {
      this.questions = JSON.parse(JSON.stringify(QuestionsEnum));
    }
    if (this.isAnswerVariantsRandom) {
      this.questions.map(question => {
        question.answer_variants = this.arrayService.shuffleArray(question.answer_variants);
      });
    }
  }

  finishTest(): void {
    this.hasTestStarted = false;
    this.hasTestFinished = true;
  }

  declineTest(): void {
    this.startAndStopSpinner();
    this.hasTestStarted = false;
  }

  updateUnPassedQuestions(question: IQuestion): void  {
    this.unPassedQuestions.push(question);
  }

  startAndStopSpinner(timeout = 800): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, timeout);
  }

  restartTest(): void {
    this.startAndStopSpinner();
    this.hasTestFinished = false;
    this.unPassedQuestions = [];
    QuestionsEnum.map(question => {
      question.answer_variants.sort((left, right) => left.id - right.id);
      question.answer_variants.map(answerVariant => {
        answerVariant.has_selected = undefined;
      });
    });
    this.questions = JSON.parse(JSON.stringify(QuestionsEnum));
  }

  changeSelectedLanguage(value: LanguagesEnum): void {
    this.selectedLanguage = value;
    localStorage.setItem('lang', value);
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light'
      ? 'dark'
      : 'light';
    localStorage.setItem('theme', this.theme);
  }
}
