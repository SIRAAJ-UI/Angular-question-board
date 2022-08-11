import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NodeService } from './nodeservice';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ThrowStmt } from '@angular/compiler';


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
  selectedConcept: any;
  usersForm: FormGroup;
  mainTotal = 0;
  indidualMarks = null;
  closeResult = '';
  gfg = false;
  marksHolder = [
    { "key": 1, mark: 0, "times": 0 },
    { "key": 2, mark: 0, "times": 0 },
    { "key": 3, mark: 0, "times": 0 },
    { "key": 5, mark: 0, "times": 0 }
  ];
  finalMarkHolder = [
    { "key": 1, mark: 0, "times": 0 },
    { "key": 2, mark: 0, "times": 0 },
    { "key": 3, mark: 0, "times": 0 },
    { "key": 5, mark: 0, "times": 0 }
  ]


  constructor(private nodeService: NodeService, private modalService: NgbModal) { }

  ngOnInit() {
    this.nodeService.getFilesystem().then(files => {
      files.forEach((file: any) => {
        if (file.concepts) {
          file.concepts.forEach(concept => {
            concept.marksHolder = this.marksHolder;
            concept.isSelected = false;
            concept.total = 0;
          })
        }
      })
      this.chapter = files;
    });
  }

  trackByMethod(index: number, el: any): number {
    return el.key;
  };

  onMarkChange(chapter, concept, markIndex, $event) {
    const targetedValue = $event.target.value;
    const filterMarkIndex = concept.marksHolder.find(mark => { return (mark.key === markIndex) });
    filterMarkIndex.mark = (Number(markIndex) * Number(targetedValue));
    filterMarkIndex.times = Number(targetedValue) * 4;
    let total = 0;
    let indidualMarks = {};
    concept.marksHolder.forEach(item => {
      indidualMarks[item.key] = item.times;
      total += Number(item.mark);
    })
    concept.total = total;
    concept.indidualMarks = indidualMarks;
    this.checkSubTotal(chapter);
    this.checkOverAllMarks();
  }

  private checkSubTotal(chapter) {
    let subTotal = 0;
    chapter.concepts.forEach(_concept => {
     
      subTotal += _concept.total
    })
    chapter.totalMarks = subTotal;
  };

  private checkOverAllMarks() {
    let overallTotal = 0;
    let keyOfMarks = {1:0,2:0,3:0,5:0};
    this.chapter.forEach(_chapter => {
      _chapter.concepts.forEach(_concept => {
        if (_concept.isSelected) {
          overallTotal += _concept.total;
          if(_concept.indidualMarks){
            for (const [key, value] of Object.entries(_concept.indidualMarks)) {
            keyOfMarks[key] = Number(keyOfMarks[key])  + (Number(value) / 4);
            }
          };
        }
      })
    })
    this.indidualMarks = keyOfMarks;
    this.mainTotal = overallTotal;
  }

  viewQuestions(content, concept) {
    this.selectedConcept = concept;
    const modalRef: any = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" }).result.then((result) => {
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

  onChangebox(chapter, concept, $event) {
    if (concept.isSelected === false) {
      chapter.totalMarks = 0;
    }
    let filterByChapter = this.chapter.filter(__chapter => { return (__chapter.chapterId === chapter.chapterId) })
    for (let i = 0; i < 4; i++) {
      const id = `a${concept.conceptId}-${i}`;
      (<HTMLInputElement>document.getElementById(id)).value = "0"
    }
    const findConcepts = filterByChapter[0].concepts.find(__concept => {
      return (__concept.conceptId === concept.conceptId)
    });
    findConcepts.marksHolder.forEach(item => {
      item.mark = 0;
      item.times = 0;
    })
    if (findConcepts) {
      findConcepts.total = 0;
      this.checkSubTotal(chapter)
      this.checkOverAllMarks();
    }
  }
}

