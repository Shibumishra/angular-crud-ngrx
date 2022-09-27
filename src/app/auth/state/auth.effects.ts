import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { loginStart, loginSucess } from "./auth.actions";
import { exhaustMap, map } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class AuthEffects {
  constructor(private action$: Actions, private authService: AuthService) { }

  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            const user = this.authService.formatUser(data);
            return loginSucess({ user });
          }));
      }))
  })
}


