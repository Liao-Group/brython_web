(function($B){

var _b_ = $B.builtins

$B.$import('token')

var TokenizerIter = $B.make_class('TokenizerIter',
    function(it){
        return {
            __class__: TokenizerIter,
            it
        }
    }
)

TokenizerIter.__iter__ = function(self){
    var js_iter = function*(){
        var line_num = 0
        while(true){
            try{
                var bytes = self.it()
            }catch(err){
                if($B.is_exc(err, [_b_.StopIteration])){
                    token = endmarker
                    token.lineno++
                    token.end_lineno++
                    yield $B.fast_tuple([token.num_type, token.string,
                                         $B.fast_tuple([token.lineno, token.col_offset]),
                                         $B.fast_tuple([token.end_lineno, token.end_col_offset]),
                                         token.line])
                }
                throw err
            }
            line_num++
            var line = _b_.bytes.decode(bytes, 'utf-8')
            for(var token of $B.tokenizer(line, 'test')){
                if(token.num_type == $B.py_tokens.ENCODING){ // skip encoding token
                    continue
                }else if(token.num_type == $B.py_tokens.ENDMARKER){
                    var endmarker = token
                    continue
                }
                token.type = token.num_type
                token.lineno = line_num
                token.end_lineno = line_num
                yield $B.fast_tuple([token.num_type, token.string,
                                     $B.fast_tuple([token.lineno, token.col_offset]),
                                     $B.fast_tuple([token.end_lineno, token.end_col_offset]),
                                     token.line])
            }
        }

    }
    return $B.generator.$factory(js_iter)()
}

TokenizerIter.__next__ = function*(self){

}

$B.set_func_names(TokenizerIter, '_tokenize')

$B.addToImported('_tokenize', {TokenizerIter})


})(__BRYTHON__)