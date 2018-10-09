import { fromEvent, Observable } from "rxjs";
import { flatMap, delay, scan, retryWhen, takeWhile } from "rxjs/operators";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function load(url: string) {
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
        retryWhen(retryStrategy({attempts: 5, delayValue: 1500}))
    );
}

function retryStrategy({attempts = 3, delayValue = 10}) {
    return function(errors) {
        return errors.pipe(
            scan(acc => acc + 1, 0),
            takeWhile(acc => acc < attempts),
            delay(delayValue)
        );
    }
}

function renderPosts(posts) {
    posts.forEach(post => {
        let div = document.createElement("div");
        let hr = document.createElement("hr");
        div.innerText = post.title;
        output.appendChild(div);
        output.appendChild(hr);
    });
}


click.pipe(
    flatMap(e => load("https://jsonplaceholder.typicode.com/posts2"))
).subscribe(
  renderPosts,
  e => console.error(`error: ${e}`),
  () => console.log("complete")
);