import { Component, Input, OnInit } from '@angular/core';
import data from '../../assets/viewdetails.json';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {

  details: any[] = [];
  closeResult = '';
  gfg = false;
  solution;
  sourceDetails;
  questionType:string = '0';
  marksType: string = '0';
  @Input("SelectedConcept") SelectedConcept:any;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    const { marksHolder } = this.SelectedConcept;
    let finalQuestions = [];
    marksHolder.forEach( item => {
      if(item.times > 0){
        finalQuestions.push(this.generateNumberOfQuestions(item));
      }
    })
    this.details = [].concat.apply([], finalQuestions);
    this.sourceDetails = [...this.details];

  }

  onFilterMarks($event:any):any{
    this.marksType = $event.target.value;
    if($event.target.value == 0){
      this.details = this.sourceDetails;
      return true;
    } 
    this.details = this.sourceDetails.filter( item => { 
      if(this.questionType == "0"){
        return (item.markType == $event.target.value)
      } else {
        return ((item.markType == $event.target.value) && (item.questionType == this.questionType ))

      }
    });
  }

  
  onFilterByPurpose($event:any):any{
    this.questionType = $event.target.value;
    if($event.target.value == 0){
      this.details = this.sourceDetails;
      return true;
    } 
    this.details = this.sourceDetails.filter( item => { 
      if(this.marksType == '0'){
        return (item.questionType == $event.target.value);
      } else {
        return ((item.markType == this.marksType) && (item.questionType == $event.target.value ))
      }
    });
  }
  generateNumberOfQuestions(item) {
   
    // console.log(item);
    const questionBank = data.data;
    const generateNewQuestion = [];
    let randomQuestion;
    let randomQType;
    const questionType = ['K','A','U']
    const _mandatory = [true,false]
    for(let i=0;i<item.times;i++) {
      randomQuestion = Math.round(Math.random() * (questionBank.length - 1));
      const mandatory = Math.round(Math.random() * 1);
      randomQType = Math.round(Math.random() * 2);
      console.log(item);
      generateNewQuestion.push({
        id:Math.round(Math.random()*1000),
        mandatory:_mandatory[mandatory],
        markType:item.key,
        marks:item.mark,
        questionType:questionType[randomQType],
        question:questionBank[randomQuestion].question,
        solution:questionBank[randomQuestion].solution
      })
    }
    return generateNewQuestion;
    // this.details = questionBank;
  }
  open(content,solution) {
    this.solution = solution;
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

}
