use serde::Serialize;
use serde_wasm_bindgen::{Error, Serializer};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct LanguageService {
    inner: wat_service::LanguageService,
    serializer: Serializer,
}

#[wasm_bindgen(js_class = LanguageService)]
impl LanguageService {
    #[wasm_bindgen(constructor)]
    pub fn new() -> LanguageService {
        LanguageService {
            inner: wat_service::LanguageService::default(),
            serializer: Serializer::json_compatible(),
        }
    }

    #[wasm_bindgen(js_name = "getOpenedUris", unchecked_return_type = "string[]")]
    pub fn get_opened_uris(&self) -> Result<JsValue, Error> {
        self.inner.get_opened_uris().serialize(&self.serializer)
    }

    #[wasm_bindgen(js_name = "setConfig")]
    pub fn set_config(&mut self, uri: String, config: JsValue) -> Result<(), Error> {
        serde_wasm_bindgen::from_value(config).map(|config| self.inner.set_config(uri, config))
    }

    #[wasm_bindgen]
    pub fn initialize(&mut self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.initialize(params).serialize(&self.serializer))
    }

    #[wasm_bindgen(js_name = "didOpen")]
    pub fn did_open(&mut self, params: JsValue) -> Result<(), Error> {
        serde_wasm_bindgen::from_value(params).map(|params| self.inner.did_open(params))
    }

    #[wasm_bindgen(js_name = "didChange")]
    pub fn did_change(&mut self, params: JsValue) -> Result<(), Error> {
        serde_wasm_bindgen::from_value(params).map(|params| self.inner.did_change(params))
    }

    #[wasm_bindgen(js_name = "didClose")]
    pub fn did_close(&mut self, params: JsValue) -> Result<(), Error> {
        serde_wasm_bindgen::from_value(params).map(|params| self.inner.did_close(params))
    }

    #[wasm_bindgen(js_name = "prepareCallHierarchy")]
    pub fn prepare_call_hierarchy(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .prepare_call_hierarchy(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "callHierarchyIncomingCalls")]
    pub fn call_hierarchy_incoming_calls(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .call_hierarchy_incoming_calls(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "callHierarchyOutgoingCalls")]
    pub fn call_hierarchy_outgoing_calls(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .call_hierarchy_outgoing_calls(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "codeAction")]
    pub fn code_action(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.code_action(params).serialize(&self.serializer))
    }

    #[wasm_bindgen(js_name = "codeLens")]
    pub fn code_lens(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.code_lens(params).serialize(&self.serializer))
    }
    #[wasm_bindgen(js_name = "codeLensResolve")]
    pub fn code_lens_resolve(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .code_lens_resolve(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen]
    pub fn completion(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.completion(params).serialize(&self.serializer))
    }

    #[wasm_bindgen(js_name = "gotoDefinition")]
    pub fn goto_definition(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .goto_definition(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "gotoTypeDefinition")]
    pub fn goto_type_definition(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .goto_type_definition(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "gotoDeclaration")]
    pub fn goto_declaration(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .goto_declaration(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "pullDiagnostics")]
    pub fn pull_diagnostics(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .pull_diagnostics(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "documentHighlight")]
    pub fn document_highlight(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .document_highlight(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "documentSymbol")]
    pub fn document_symbol(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .document_symbol(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "foldingRange")]
    pub fn folding_range(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.folding_range(params).serialize(&self.serializer))
    }

    #[wasm_bindgen]
    pub fn formatting(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.formatting(params).serialize(&self.serializer))
    }
    #[wasm_bindgen(js_name = "rangeFormatting")]
    pub fn range_formatting(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .range_formatting(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen]
    pub fn hover(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.hover(params).serialize(&self.serializer))
    }

    #[wasm_bindgen(js_name = "inlayHint")]
    pub fn inlay_hint(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.inlay_hint(params).serialize(&self.serializer))
    }

    #[wasm_bindgen(js_name = "findReferences")]
    pub fn find_references(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .find_references(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "prepareRename")]
    pub fn prepare_rename(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .prepare_rename(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen]
    pub fn rename(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params)
            .and_then(|params| self.inner.rename(params).serialize(&self.serializer))
    }

    #[wasm_bindgen(js_name = "selectionRange")]
    pub fn selection_range(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .selection_range(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "semanticTokensFull")]
    pub fn semantic_tokens_full(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .semantic_tokens_full(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "semanticTokensRange")]
    pub fn semantic_tokens_range(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .semantic_tokens_range(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "signatureHelp")]
    pub fn signature_help(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .signature_help(params)
                .serialize(&self.serializer)
        })
    }

    #[wasm_bindgen(js_name = "prepareTypeHierarchy")]
    pub fn prepare_type_hierarchy(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .prepare_type_hierarchy(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "typeHierarchySupertypes")]
    pub fn type_hierarchy_supertypes(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .type_hierarchy_supertypes(params)
                .serialize(&self.serializer)
        })
    }
    #[wasm_bindgen(js_name = "typeHierarchySubtypes")]
    pub fn type_hierarchy_subtypes(&self, params: JsValue) -> Result<JsValue, Error> {
        serde_wasm_bindgen::from_value(params).and_then(|params| {
            self.inner
                .type_hierarchy_subtypes(params)
                .serialize(&self.serializer)
        })
    }
}
