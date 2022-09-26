import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { updatePost } from '../state/posts.action';
import { getPostById } from '../state/posts.selector';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {
  post!: Post;
  postForm!: FormGroup;
  postSubscription: Subscription | undefined;
  constructor(private route: ActivatedRoute, private store: Store<AppState>, private router: Router) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.postSubscription = this.store
        .select(getPostById, { id })
        .subscribe(data => {
          this.post = data;
          this.createForm()
        });
    });
  };

  createForm() {
    this.postForm = new FormGroup({
      title: new FormControl(this.post?.title, [
        Validators.required,
        Validators.minLength(6)
      ]),
      description: new FormControl(this.post?.description, [
        Validators.required,
        Validators.minLength(10)
      ]),
    });
  };

  showTextErrors(): any {
    const titleForm: any = this.postForm.get('title');
    if (titleForm.touched && !titleForm.valid) {
      if (titleForm.errors.required) {
        return 'Title is required';
      }
      if (titleForm.errors.minlength) {
        return 'Title should be of minimum 6 characters length';
      }
    }
  };

  showDescriptionErrors(): any {
    const descriptionForm: any = this.postForm.get('description');
    if (descriptionForm.touched && !descriptionForm.valid) {
      if (descriptionForm.errors.required) {
        return 'Description is required';
      }
      if (descriptionForm.errors.minlength) {
        return 'Description should be of minimum 10 characters length';
      }
    }
  };

  onSubmit() {
    if (!this.postForm.valid) {
      return;
    }

    const title = this.postForm.value.title;
    const description = this.postForm.value.description;

    const post: Post = {
      id: this.post.id,
      title,
      description,
    }

    this.store.dispatch(updatePost({ post }));
    this.router.navigate(['posts'])
  };


  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
