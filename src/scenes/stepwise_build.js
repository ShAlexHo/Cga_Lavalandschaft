export function finishBuild(build) {
    let step = build.next();
    while (!step.done) step = build.next();
    return step.value;
}
