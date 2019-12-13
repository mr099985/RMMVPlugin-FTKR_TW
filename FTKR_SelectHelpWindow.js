//=============================================================================
// 選択肢ウィンドウを表示中に選択肢の説明ウィンドウを表示するプラグイン
// 顯示選擇視窗時顯示說明視窗的插件
// FTKR_SelectHelpWindow.js
// プラグインNo : 81
// 作成者     : フトコロ
// 作成日     : 2018/04/15
// 最終更新日 : 2018/08/06
// バージョン : v1.1.0
//=============================================================================

var Imported = Imported || {};
Imported.FTKR_SHW = true;

var FTKR = FTKR || {};
FTKR.SHW = FTKR.SHW || {};

//=============================================================================
/*:
 * @plugindesc v1.1.0 顯示選擇視窗時，同時顯示說明視窗
 * @author フトコロ( 翻譯 : ReIris )
 *
 * @param Enable Hide Window
 * @text 隱藏說明視窗
 * @desc 如果沒有為選擇設定說明，則隱藏說明視窗。
 * @type boolean
 * @on 隱藏
 * @off 顯示
 * @default false
 *
 * @help 
 *-----------------------------------------------------------------------------
 * 摘要
 *-----------------------------------------------------------------------------
 * 顯示選擇視窗時，將顯示另一個視窗，該視窗顯示每個選擇的說明。
 * 
 * 建立說明內容需要使用事件命令的「說明」。
 * 如果在說明的第一行中輸入<SHW_Description>，會將以下的內容當作說明內容顯示。
 * 
 * 建立的事件如下所示。
 * 
 * ◆顯示選擇：Yes, No (視窗, 右, #1, #2)
 * ：當 Yes
 *   ◆說明：<SHW_Description>
 *   ：　　：「Yes」選擇中的說明內容。
 *   ◆
 * ：當 No
 *   ◆說明：<SHW_Description>
 *   ：　　：「No」選擇中的說明內容。
 *   ◆
 * ：結束
 * 
 * 
 * 說明視窗將固定顯示在畫面上方。
 * 最多可以顯示兩行說明內容。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 設定方法
 *-----------------------------------------------------------------------------
 * 1. 於「插件管理器」中，添加本插件。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 關於此插件的許可證(License)
 *-----------------------------------------------------------------------------
 * 該插件是根據 MIT 許可發佈的。
 * This plugin is released under the MIT License.
 * 
 * Copyright (c) 2018 Futokoro
 * http://opensource.org/licenses/mit-license.php
 * 
 * 
 * 插件公開來源：
 * https://github.com/futokoro/RPGMaker/blob/master/README.md
 * 
 * 
 *-----------------------------------------------------------------------------
 * 變更記錄
 *-----------------------------------------------------------------------------
 * 
 * v1.1.0 - 2018/08/06 : 機能追加
 *    1. 注釈の設定がない場合は、説明ウィンドウを非表示にする機能を追加。
 * 
 * v1.0.0 - 2018/04/15 : 初版作成
 * 
 *-----------------------------------------------------------------------------
*/
//=============================================================================

(function() {
    var parameters = PluginManager.parameters('FTKR_SelectHelpWindow');
    FTKR.SHW.enableHideWindow = JSON.parse(parameters['Enable Hide Window'] || false);

    //=============================================================================
    // Game_Interpreter
    //=============================================================================
    var _SHW_Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
        _SHW_Game_Interpreter_setupChoices.call(this, params);
        var texts = this.setupChoiceHelpMessage();
        $gameMessage.setChoiceHelpTexts(texts);
    };

    Game_Interpreter.prototype.listCode = function(index) {
        var command = this._list[index];
        if (command) {
            return command.code;
        } else {
            return 0;
        }
    };

    Game_Interpreter.prototype.setupChoiceHelpMessage = function() {
        var index = this._index;
        var texts = [];
        var textIndex = 0;
        for (var i = index; i < this._list.length; i++) {
            if (this.listCode(i) === 404) return texts;
            if (this.listCode(i) === 108 && this._list[i].parameters[0] === '<SHW_Description>') { // 注釈
                i++;
                texts[textIndex] = '';
                for (var j = i; j < this._list.length; j++) {
                    if (this.listCode(j) !== 408) break;
                    texts[textIndex] += this._list[j].parameters[0] + '\n';
                }
                textIndex++;
            }
        }
        return texts;
    };

    //=============================================================================
    // Game_Message
    //=============================================================================

    Game_Message.prototype.setChoiceHelpTexts = function(texts) {
        this._choiceHelpTexts = texts;
    };

    //=============================================================================
    // Scene_Map
    //=============================================================================

    var _SHW_Scene_Map_createMessageWindow = Scene_Map.prototype.createMessageWindow;
    Scene_Map.prototype.createMessageWindow = function() {
        _SHW_Scene_Map_createMessageWindow.call(this);
        this.addWindow(this._messageWindow.choiceHelpWindow());
    };

    var _SHW_Scene_Battle_createMessageWindow = Scene_Battle.prototype.createMessageWindow;
    Scene_Battle.prototype.createMessageWindow = function() {
        _SHW_Scene_Battle_createMessageWindow.call(this);
        this.addWindow(this._messageWindow.choiceHelpWindow());
    };

    //=============================================================================
    // Window_ChoiceList
    //=============================================================================
    Window_ChoiceList.prototype.setHelpWindowText = function(text) {
        if (this._helpWindow) {
            this._helpWindow.setText(text);
            this._helpWindow.show();
        }
    };

    Window_ChoiceList.prototype.updateHelp = function() {
        var text = $gameMessage._choiceHelpTexts[this.index()];
        if (FTKR.SHW.enableHideWindow && (text == undefined || !text)) {
            this._helpWindow.hide();
        } else {
            this.setHelpWindowText(text);
        }
    };

    Window_ChoiceList.prototype.helpWindow = function() {
        return this._messageWindow.choiceHelpWindow();
    };

    var _SHW_Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        _SHW_Window_ChoiceList_start.call(this);
        this.helpWindow().open();
    };

    var _SHW_Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
    Window_ChoiceList.prototype.callOkHandler = function() {
        _SHW_Window_ChoiceList_callOkHandler.call(this);
        this.helpWindow().close();
    };

    var _SHW_Window_ChoiceList_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler;
    Window_ChoiceList.prototype.callCancelHandler = function() {
        _SHW_Window_ChoiceList_callCancelHandler.call(this);
        this.helpWindow().close();
    };

    //=============================================================================
    // Window_Message
    //=============================================================================

    var _SHW_Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function() {
        _SHW_Window_Message_createSubWindows.call(this);
        this.createChoiceHelpWIndow();
    };

    Window_Message.prototype.createChoiceHelpWIndow = function() {
        this._helpWindow = new Window_Help();
        this._helpWindow.close();
        this._helpWindow.openness = 0;
        this._choiceWindow.setHelpWindow(this._helpWindow);
    };

    Window_Message.prototype.choiceHelpWindow = function() {
        return this._helpWindow;
    };

}());//EOF
