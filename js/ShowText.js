class RevalingText{
    constructor(config){
        this.element = config. element;
        this.text = config.text;
        this.speed = config.element || 200;


        this.timeout = null;
        this.isDone = false;
    }

    revealOneCharacter(list){
        const next = list.splice(0,1)[0];
        next.span.classList.add('show');
        if(list.length > 0){
            this.timeout = setTimeout(() => {
                this.revealOneCharacter(list)
            }, 70)
        }else{
            this.isDone = true;
        }
    }

    warpToDone(){
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll('span').forEach(s =>{
            s.classList.add('show')
        })
    }

    init(){
        let characters = [];
        this.text.split('').forEach(character => {
            let span = document.createElement('span');
            span.textContent = character;
            this.element.appendChild(span);

            characters.push({
                span,
                delayAfter: character === ' ' ? 0 : this.speed
            })
        })

        this.revealOneCharacter(characters);
    }
}