class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("textMessage");

    this.element.innerHTML = (`
      <p class="textMessage__txt"></p>
      <button class="textMessage__button">Next</button>
    `)



    this.revalingText = new RevalingText({
      element: this.element.querySelector(".textMessage__txt"),
      text: this.text
    })




    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      
      this.done();
    })

  }

  done() {

    if(this.revalingText.isDone){
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    }else{
      this.revalingText.warpToDone();
    }
    
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revalingText.init();
  }

}