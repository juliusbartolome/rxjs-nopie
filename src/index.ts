import { fromEvent, from, of, merge, Observable, throwError } from "rxjs";
import { flatMap, catchError } from "rxjs/operators";
import { load, loadWithFetch } from "./dataLoader";

// let source = merge(
//     of(1),
//     from([2, 3, 4]),
//     throwError(new Error("Stop!")),
//     of(5)
// );

// // let source = Observable.create(observer => {
// //     observer.next(1);
// //     observer.next(2);
// //     observer.error("Stop!");
// //     throw new Error("Stop! Error thrown!");
// //     observer.next(3);
// //     observer.complete();
// // });

// source = source.pipe(
//     catchError(error => {
//         console.error(`caught: ${error}`);
//         return of(10);
//     })
// );

// source.subscribe(
//     value => console.log(`value: ${value}`),
//     error => console.error(`error: ${error}`),
//     () => console.log("complete")
// );

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function renderPosts(posts) {
    posts.forEach(post => {
        let div = document.createElement("div");
        let hr = document.createElement("hr");
        div.innerText = post.title;
        output.appendChild(div);
        output.appendChild(hr);
    });
}

let subscription = load("https://jsonplaceholder.typicode.com/posts")
    .subscribe(
        renderPosts,
        e => console.log(`error: ${e}`),
        () => console.log("complete")
    );

console.log(subscription);
subscription.unsubscribe();


click.pipe(
    flatMap(e => loadWithFetch("https://jsonplaceholder.typicode.com/posts"))
).subscribe(
    renderPosts,
    e => console.error(`error: ${e}`),
    () => console.log("complete")
);