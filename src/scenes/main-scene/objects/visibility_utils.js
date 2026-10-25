export function bindVisibility(target) {
    return {
        getVisible: () => target.visible,
        setVisible: value => { target.visible = value; },
    };
}
