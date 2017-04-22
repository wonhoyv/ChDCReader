"use strict"
define(["jquery", "main", "Page", "util", "uiutil", "cookie"], function($, app, Page, util, uiutil, cookie){

  class MyPage extends Page{

    onLoad(params){
      this.loadView();
    }

    loadData(){
      return util.getJSON('data/exploresource.json')
        .then(json => {
          this.exploresources = {};
          for(let key of json.valid){
            this.exploresources[key] = json.sources[key];
          }
        });
    }

    loadView(){
      $('#btnClose').click(e => this.close());
      this.loadData()
        .then(() => this.loadList());
    }

    loadList(){
      let list = $('#list').empty();
      for(let key of Object.keys(this.exploresources)){
        let es = this.exploresources[key];
        let ese = $('.template > .list-item').clone();
        ese.find("img.booksource-logo").attr('src', es.logo ? es.logo : `img/logo/${key}.png`);
        ese.find(".booksource-name").text(app.bookSourceManager.getBookSource(key).name);
        ese.find(".booksource-type").text(app.bookSourceManager.getBookSourceTypeName(key));
        ese.click(e => this.showExplorPage(key, es));
        list.append(ese);
      }
    }

    showExplorPage(bsid, es){
      let ref = window.open(es.url, "_blank", "location=no,clearcache=yes,clearsessioncache=yes,zoom=no");

      // loadstart
      ref.addEventListener("loadstart", (e) => {
        let url = e.url;
        for(let pageName of ["readbook"]){
          let config = es[pageName];
          let matcher = url.match(config.matcher);
          if(!matcher) continue;
          // 匹配了
          ref.hide();
          let bookid = matcher[1];
          app.bookSourceManager.getBookInfo(bsid, {bookid: bookid})
            .then(book => {
              app.page.showPage(pageName, {book: book})
                .then(page => {
                  page.addEventListener('myclose', () => {
                    ref.show();
                    ref.executeScript({ code: "history.back()" });
                  });
                });
            });
        }
      });

      // loadstop
      ref.addEventListener('loadstop', function(e) {
        let url = e.url;
        debugger;
        if(es.insertCSS)
          ref.insertCSS({code: es.insertCSS});
        if(es.executeScript)
          ref.executeScript({ code: es.executeScript});
      });
    }
  }

  return MyPage;
});