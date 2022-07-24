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

  marksHolder = {
    "1": 0,
    "2": 0,
    "3": 0,
    "5": 0,
}
options = [
  {
      "data": 0,
      "value": 0,
      "selected": false
  },
  {
      "data": 1,
      "value": 1,
      "selected": false
  },
  {
      "data": 2,
      "value": 2,
      "selected": false
  },
  {
      "data": 3,
      "value": 3,
      "selected": false
  },
  {
      "data": 4,
      "value": 4,
      "selected": false
  },
  {
      "data": 5,
      "value": 5,
      "selected": false
  },
  {
      "data": 10,
      "value": 10,
      "selected": false
  }
]

  constructor(private nodeService: NodeService) { }


  ngOnInit() {
    this.nodeService.getFilesystem().then(files => { 
      files.forEach( (file:any) => {
        if(file.concepts) {
          file.concepts.forEach( concept => {
            console.log(concept)
            concept.marksHolder = this.marksHolder;
            concept.options = this.options;
            concept.isSelected = false;
            concept.total = 0;
          })
        }
      })
      // console.log(files)

      this.chapter = files
     });
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
    }
       let filterByChapter = this.chapter.filter( __chapter => { return ( __chapter.chapterId === chapter.chapterId)})
        filterByChapter[0].concepts.forEach( __concept => {
          __concept.marksHolder = {
            "1":0,
            "2":0,
            "3":0,
            "5":0
        }
        for(let i=0;i<4;i++) {
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

