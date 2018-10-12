import { from, Observable, defer } from "rxjs";
import { delay, scan, retryWhen } from "rxjs/operators";

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
        let promise = fetch(url)
                        .then(response => {
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                return Promise.reject(response);
                            }
                        });
        
        return from(promise);
    }).pipe(
        retryWhen(retryStrategy())
    );
}

function retryStrategy({ attempts = 4, delayValue = 10 } = {}) {
    return function (errors) {
        return errors.pipe(
            scan(acc => {
                console.log(errors);
                
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(errors);
                }
            }, 0),
            delay(delayValue)
        );
    }
}