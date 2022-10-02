import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { loginStart, loginSucess, singUpStart, singUpSucess } from "./auth.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.action";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
  constructor(
    private action$: Actions,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
  ) { }

  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            this.store.dispatch(setErrorMessage({ message: '' }));
            const user = this.authService.formatUser(data);
            return loginSucess({ user });
          }),
          catchError((error) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMessage = this.authService.getErrorMessage(error.error.error.message);
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      }))
  });

  loginRedirect$ = createEffect(() => {
    return this.action$.pipe(ofType(loginSucess), tap(action => {
      this.store.dispatch(setErrorMessage({message: ''}));
      this.router.navigate(['/']);
    }))
  }, { dispatch: false });


  sugnUp$ = createEffect(() => {
    return this.action$.pipe(ofType(singUpStart), exhaustMap(action => {
      return this.authService.signUp(action.email, action.password).pipe(map(data => {
        this.store.dispatch(setLoadingSpinner({ status: false }));
        const user = this.authService.formatUser(data);
        return singUpSucess({ user });
      }),
      catchError((error) => {
        this.store.dispatch(setLoadingSpinner({ status: false }));
        const errorMessage = this.authService.getErrorMessage(error.error.error.message);
        return of(setErrorMessage({ message: errorMessage }));
      })
      );
    }))
  });


  signUpRedirect$ = createEffect(() => {
    return this.action$.pipe(ofType(singUpSucess), tap(action => {
      this.store.dispatch(setErrorMessage({message: ''}));
      this.router.navigate(['/']);
    }))
  }, { dispatch: false });
}


