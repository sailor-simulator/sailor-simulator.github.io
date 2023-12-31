import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguagesEnum } from 'src/app/data/languages.enum';
import { DarkThemeText, FinishTestText, FromText, QuestionText } from 'src/app/data/texts.enum';
import { IAnswerVariant } from 'src/app/interfaces/answer-variant.interface';
import { IQuestion } from 'src/app/interfaces/question.interface';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  @Input() selectedLanguage: LanguagesEnum = LanguagesEnum.BY;
  @Input() isAnswerVariantsRandom: boolean;
  @Input() questions: IQuestion[];
  @Input() isDarkTheme: boolean;

  @Output() errorAnswer = new EventEmitter<IQuestion>();
  @Output() testFinished = new EventEmitter();
  @Output() testDeclined = new EventEmitter();
  @Output() isLoading = new EventEmitter<boolean>();
  @Output() themeChanged = new EventEmitter();

  counter = 0;
  questionText = QuestionText;
  fromText = FromText;
  finishTestText = FinishTestText;
  darkThemeText = DarkThemeText;
  isQuestionVisible = true;

  get currentProgress(): number {
    return Math.round((this.counter + 1) / this.questions.length * 100);
  }

  selectAnswerVariant(answerVariant: IAnswerVariant, question: IQuestion): void {
    answerVariant.has_selected = true;
    const rightAnswer =  question.answer_variants.filter(item => item.is_correct)[0];
    if (answerVariant.id !== rightAnswer.id) {
      this.errorAnswer.emit(question);
    }
    
    setTimeout(() => {
      this.isQuestionVisible = false;
      this.isLoading.emit();
    }, 800);


    setTimeout(() => {
      this.isQuestionVisible = true;
      if (this.counter < this.questions.length - 1) {
        this.counter++;
      } else {
        this.testFinished.emit();
      }
    }, 1200);
  }

  finishTest(): void {
    this.testDeclined.emit();
  }
}
