;(function(factory){
   if(typeof(define) == "function" && define.amd){
       define(function(){
           return function(select){ factory(select); };
       });
   } else {
       if(typeof(window.tail) != "undefined" && window.tail.select){
           factory(window.tail.select);
       }
   }
}(function(select){
    select.strings.register("pt", {
        all: "Todas",
        none: "Nenhuma",
        actionAll: "Selecionar todas",
        actionNone: "Desmarcar todas",
        empty: "Nenhuma opção disponível",
        emptySearch: "Nenhuma opção encontrada",
        limit: "Não é possível selecionar outra opção",
        placeholder: "Escolha uma opção ...",
        placeholderMulti: "Escolha até: :limit opção(ões) ...",
        search: "Buscar ...",
        disabled: "Campo desativado"
    });
    return select;
}));
