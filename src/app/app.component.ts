import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NodeService } from './nodeservice';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


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
  selectedConcept:any;
  usersForm: FormGroup;
  mainTotal = 0;
  closeResult = '';
  gfg = false;
  marksHolder = [
    {"key":1,mark:0,"times":0},
    {"key":2,mark:0,"times":0},
    {"key":3,mark:0,"times":0},
    {"key":5,mark:0,"times":0}
  ];
   
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
  ];

  constructor(private nodeService: NodeService,private modalService: NgbModal) { }

  ngOnInit() {
    this.nodeService.getFilesystem().then(files => { 
      files.forEach( (file:any) => {
        if(file.concepts) {
          file.concepts.forEach( concept => {
            concept.marksHolder = this.marksHolder;
            concept.options = this.options;
            concept.isSelected = false;
            concept.total = 0;
          })
        }
      })
      this.chapter = files
     });
  }

 

  trackByMethod(index: number, el: any): number {
    return el.key;
  }
  onMarkChange(chapter,concept, markIndex, $event) {
    const targetedValue = $event.target.value;
    const filterMarkIndex = concept.marksHolder.find( mark => { return (mark.key === markIndex)});
    filterMarkIndex.mark =  (Number(markIndex) * Number(targetedValue));
    filterMarkIndex.times =  (Number(markIndex) * Number(targetedValue)) + 4;
    let total = 0;
    concept.marksHolder.forEach( item => {
      total += Number(item.mark);
    })
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

  viewQuestions(content,concept) {
    // concept.markAddedByFour = [];
    // let markTimes = 0;
    // for (const item of Object.entries(concept.marksHolder)) {
    //   markTimes = Number(item[1]) > 0 ? (Number(item[1]) + 4) : 0;
    //   concept.markAddedByFour.push({mark:item[0],count: markTimes})
    // }
    this.selectedConcept = concept;
    const modalRef:any = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:"lg" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onChangebox(chapter,concept,$event) {
    if(concept.isSelected === false) {
       chapter.totalMarks = 0;
    }
       let filterByChapter = this.chapter.filter( __chapter => { return ( __chapter.chapterId === chapter.chapterId)})
        filterByChapter[0].concepts.forEach( __concept => {
          __concept.marksHolder.forEach( item => {
              item.mark = 0;
              item.times = 0;
          })
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

