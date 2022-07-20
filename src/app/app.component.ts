import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NodeService } from './nodeservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rnd';
  chapter: any[];
  marksList: any[] = [];
  marksListItem: any[] = [];
  usersForm: FormGroup;
  mainTotal = 0;

  constructor(private nodeService: NodeService) { }


  ngOnInit() {
    this.nodeService.getFilesystem().then(files => this.chapter = files);
  }

 

  trackByMethod(index: number, el: any): number {
    return el.key;
  }
  onMarkChange(chapter,concept, markIndex, $event) {
    const targetedValue = $event.target.value;
    concept.marksHolder[markIndex] = Number(markIndex) * Number(targetedValue);
    const keys = Object.keys(concept.marksHolder);
    let total = 0;
    keys.forEach((key, index) => {
      total += Number(concept.marksHolder[key]);
    });
    concept.total = total;
    this.checkSubTotal(chapter);
    this.checkOverAllMarks();
  }

  private checkSubTotal(chapter) {
    let subTotal = 0;
    chapter.concepts.forEach( _concept => {
        subTotal += _concept.total
      })
    chapter.totalMarks = subTotal;
  };

  private checkOverAllMarks() {
      let overallTotal = 0;
      this.chapter.forEach( _chapter => {
        _chapter.concepts.forEach( _concept => {
          overallTotal += _concept.total
        })
      })
    this.mainTotal = overallTotal;
  }

  onChangebox(chapter,concept,$event) {
    if(concept.isSelected === false) {
       chapter.totalMarks = 0;
       let filterByChapter = this.chapter.filter( __chapter => { return ( __chapter.chapterId === chapter.chapterId)})
        filterByChapter[0].concepts.forEach( __concept => {
          __concept.marksHolder = {
            "1":0,
            "2":0,
            "3":0,
            "5":0,
            "10":0
        }
        for(let i=0;i<5;i++) {
          const id = `a${concept.conceptId}-${i}`;
          (<HTMLInputElement>document.getElementById(id)).value = "0"
        }
        if(concept.conceptId === __concept.conceptId) {
          concept.total = 0;
          this.checkSubTotal(chapter)
          this.checkOverAllMarks();
        }
        })
    }
  }
}

