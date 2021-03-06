import { Component, Input, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Entry} from "../../models/entry";
import {EntryService} from "../../services/entry.service";
import {Baslik} from "../../models/baslik";
import { Kategori } from 'src/app/models/kategori';
import { CategoryService } from 'src/app/services/category.service';
import { BaslikService } from 'src/app/services/baslik.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-right-part',
  templateUrl: './right-part.component.html',
  styleUrls: ['./right-part.component.css']
})
export class RightPartComponent implements OnInit {

  constructor(private entryService: EntryService, 
    private categoryService: CategoryService,
    private baslikService: BaslikService) { }

  baslik: Baslik = {"id":null, "title":null, "kategoriId":null};
  entries: Entry[];
  categories: Kategori[];
  baslikAdi: string;

  ngOnInit(): void {
    this.loadKategori();
  }

  onClicked(baslik:Baslik) {
    this.baslik = baslik;
    //console.log("app comp" + id);
    this.entryService.getEntriesOfBaslik(baslik.id).subscribe((data) => {
      this.entries = data;
    });
  }

  loadKategori() {
    this.categoryService.getKategoriler().subscribe((data) => {
      this.categories = data;
    })
  }

  submitForm(form: NgForm) {
    if (!this.baslik.title) {
      let baslik_id: number;
      this.baslik = {id:null, title: form.value.baslikAdi, kategoriId: form.value.kategoriler };
      console.log(this.baslik);
      this.baslikService.addBaslik(this.baslik).subscribe((data) => {
        this.baslik = data;
        console.log(this.baslik);
        baslik_id = this.baslik.id

        let newEntry: Entry = {id: null,
          content: form.value.entry,
          begeniler: 0,
          baslikId: baslik_id};
    
        this.entryService.addEntry(newEntry).subscribe((data) => {
    
          if(!this.entries) {
            this.entries = [];
          }
          this.entries.push(data);
        });

      });
    } 
    else {
      let newEntry: Entry = {id: null,
        content: form.value.entry,
        begeniler: 0,
        baslikId: this.baslik.id};
  
      this.entryService.addEntry(newEntry).subscribe((data) => {
  
        if(!this.entries) {
          this.entries = [];
        }
        this.entries.push(data);
      });   
    }
       

  }

}
