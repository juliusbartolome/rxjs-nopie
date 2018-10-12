import { from, Observable, defer } from "rxjs";
import { delay, scan, retryWhen, takeWhile } from "rxjs/operators";

export function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
            if (xhr.status == 200) {
                observer.next(JSON.parse(xhr.responseText))
            } else {
                observer.error(xhr.status);
            }
        });
        xhr.open("GET", url);
        xhr.send();
    }).pipe(
        retryWhen(retryStrategy({ attempts: 5, delayValue: 1500 }))
    );
}

export function loadWithFetch(url: string) {
    return defer(() => {
        let promise = fetch(url).then(r => r.json());
        return from(promise);
    });
}

function retryStrategy({ attempts = 3, delayValue = 10 }) {
    return function (errors) {
        return errors.pipe(
            scan(acc => acc + 1, 0),
            takeWhile(acc => acc < attempts),
            delay(delayValue)
        );
    }
}