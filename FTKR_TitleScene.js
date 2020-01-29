//=============================================================================
// タイトルシーンを改造するプラグイン
// FTKR_TitleScene.js
// プラグインNo : 85
// 作成者     : フトコロ
// 作成日     : 2018/05/06
// 最終更新日 : 2019/04/14
// バージョン : v1.0.1
//=============================================================================

var Imported = Imported || {};
Imported.FTKR_TS = true;

var FTKR = FTKR || {};
FTKR.TS = FTKR.TS || {};

//=============================================================================
/*:
 * @plugindesc v1.0.1 修改標題畫面的插件
 * @author フトコロ( 翻譯 : ReIris )
 *
 * @param コンティニューコマンド
 * @text 讀取命令
 * @desc 設定是否顯示讀取。
 * @default 1
 * @type select
 * @option 顯示
 * @value 1
 * @option 不顯示
 * @value 0
 *
 * @param オプションコマンド
 * @text 設定命令
 * @desc 設定是否顯示設定。
 * @default 1
 * @type select
 * @option 顯示
 * @value 1
 * @option 不顯示
 * @value 0
 *
 * @param クレジットコマンド
 * @text 感謝名單命令
 * @desc 設定是否顯示感謝名單。
 * @default
 * @type struct<credit>
 * 
 * @param コマンドウィンドウ設定
 * @text 命令窗口設定
 * @desc 變更命令窗口的排版。
 * @default {"fontsize":"28","padding":"18","lineHeight":"36","opacity":"192","hideFrame":"1"}
 * @type struct<window>
 * 
 * 
 * @help 
 *-----------------------------------------------------------------------------
 * 摘要
 *-----------------------------------------------------------------------------
 * 修改標題畫面。
 * 
 * １．可以設定讀取跟設定的顯示有無。
 * ２．標題命令的文字大小跟顏色可以變更。
 * ３．命令可以追加感謝名單。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 設定方法
 *-----------------------------------------------------------------------------
 * 1.於「插件管理器」中，追加本插件。
 * 
 *-----------------------------------------------------------------------------
 * 關於此插件的許可證（License）
 *-----------------------------------------------------------------------------
 * 該插件是根據 MIT 許可發佈的。
 * This plugin is released under the MIT License.
 * 
 * Copyright (c) 2018 Futokoro
 * http://opensource.org/licenses/mit-license.php
 * 
 *-----------------------------------------------------------------------------
 * 變更記錄
 *-----------------------------------------------------------------------------
 * 
 * v1.0.1 - 2019/04/14 : 不具合修正
 *    1. プラグインパラメータのクレジットコマンドを設定しない場合にエラーになる不具合を修正。
 * 
 * v1.0.0 - 2018/05/06 : 初版作成
 * 
 *-----------------------------------------------------------------------------
*/
//=============================================================================
/*~struct~credit:
 * @param enable
 * @text 感謝名單
 * @desc 指定該命令是否顯示。
 * @type boolean
 * @on 顯示
 * @off 不顯示
 * @default false
 * 
 * @param name
 * @text 命令名稱
 * @desc 設定命令的顯示名稱。
 * @type text
 * @default "感謝名單"
 * 
 * @param enableType
 * @text 素材種類選擇
 * @desc 指定是否顯示素材種類的選擇命令。
 * @type boolean
 * @on 顯示
 * @off 不顯示
 * @default true
 * 
 * @param helpDesc
 * @text 幫助說明
 * @desc 在感謝名單畫面上設定幫助窗口的描述。
 * 可以在「文本」中使用控制字元。
 * @type text
 * @default "將顯示此遊戲中所用素材聲明和作者。"
 * 
 * @param itemList
 * @text 感謝對象
 * @desc 感謝名單中顯示的對象設定。
 * @type struct<creditItem>[]
 * @default []
 * 
*/
/*~struct~creditItem:
 * @param itemName
 * @text 素材名稱
 * @desc 設定該素材的名稱。
 * @type text
 * @default 
 * 
 * @param itemType
 * @text 素材種類
 * @desc 指定素材的種類。
 * @type select
 * @default 
 * @option 其他
 * @value 0
 * @option 插件
 * @value 1
 * @option 圖片
 * @value 2
 * @option 音樂
 * @value 3
 * @option 字體
 * @value 4
 * @option 動畫
 * @value 5
 * 
 * @param authorName
 * @text 素材作者名
 * @desc 設定素材作者的名稱。(省略敬稱)
 * @type text
 * @default 
 * 
 * @param itemLink
 * @text 素材來源
 * @desc 設定該素材的來源。
 * @type text
 * @default 
 * 
 * @param itemDesc
 * @text 素材說明
 * @desc 描述該素材的說明文。可以在「文本」中使用控制字元。
 * @type text
 * @default 
 * 
*/
/*~struct~window:
 * @param fontsize
 * @text 字體大小
 * @desc 設定標題命令的字體大小。
 * @default 28
 * @type number
 *
 * @param padding
 * @text 留白
 * @desc 設定標題命令窗口的留白。
 * @default 18
 * @type number
 * @min 0
 *
 * @param lineHeight
 * @text 行高
 * @desc 設定標題命令窗口的行高。
 * 0 - 將自動調整最適合尺寸。
 * @default 36
 * @type number
 * @min 0
 *
 * @param opacity
 * @text 背景透明度
 * @desc 設定窗口內背景的透明度。
 * @default 192
 * @type number
 * @min 0
 * 
 * @param hideFrame
 * @text 邊框是否顯示
 * @desc 設定是否顯示窗口邊框。
 * @default 1
 * @type select
 * @option 顯示
 * @value 1
 * @option 不顯示
 * @value 0
*/

(function() {

    var paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };

    var paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    //=============================================================================
    // プラグイン パラメータ
    //=============================================================================
    var parameters = PluginManager.parameters('FTKR_TitleScene');

    FTKR.TS = {
        command : {
            continue : Number(parameters['コンティニューコマンド'] || 0),
            option   : Number(parameters['オプションコマンド'] || 0),
        },
        credit  : paramParse(parameters['クレジットコマンド']) || {},
        window  : paramParse(parameters['コマンドウィンドウ設定']) || {},
        typeName : [
            '其他',
            '插件',
            '圖片',
            '音樂',
            '字體',
            '動畫'
        ],
    };

    /*-------------------------------------------------------------------------/
    // Scene_Title
    /-------------------------------------------------------------------------*/
    var _TS_Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _TS_Scene_Title_create.call(this);
        if (this.onCredit()) {
            this.createHelpWindow();
            if (this.onCreditType()) {
                this.createCreditItemTypeWindow();
            }
            this.createCreditItemListWindow();
        }
    };

    Scene_Title.prototype.onCredit = function() {
        return FTKR.TS.credit && FTKR.TS.credit.enable;
    };

    Scene_Title.prototype.onCreditType = function() {
        return FTKR.TS.credit && FTKR.TS.credit.enableType;
    };

    Scene_Title.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help();
        this._helpWindow._openness = 0;
        this.addWindow(this._helpWindow);
        this._helpWindow.setText(FTKR.TS.credit.helpDesc);
        this._helpWindow.close();
    };

    var _TS_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _TS_Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('credit',  this.commandCredit.bind(this));
    };

    Scene_Title.prototype.commandCredit = function() {
        this._commandWindow.close();
        this._helpWindow.open();
        if (this.onCreditType()) {
            this._creditTypeWindow.open();
            this._creditTypeWindow.activate();
            this._creditTypeWindow.select(0);
        } else {
            this._creditListWindow.activate();
            this._creditListWindow.select(0);
        }
        this._creditListWindow.open();
    };

    var _TS_Scene_Title_isBusy = Scene_Title.prototype.isBusy;
    Scene_Title.prototype.isBusy = function() {
        var active = this.onCredit() ?
            this.onCreditType() ? this._creditTypeWindow.active || this._creditListWindow.active : this._creditListWindow.active :
            false;
        return active || _TS_Scene_Title_isBusy.call(this);
    };

    Scene_Title.prototype.createCreditItemTypeWindow = function() {
        var y = this._helpWindow.y + this._helpWindow.height;
        this._creditTypeWindow = new Window_CreditItemType(0, y);
        this._creditTypeWindow.setHandler('type',  this.typeSelect.bind(this));
        this._creditTypeWindow.setHandler('cancel',  this.cancelCreditType.bind(this));
        this.addWindow(this._creditTypeWindow);
    };

    Scene_Title.prototype.createCreditItemListWindow = function() {
        var y = this.onCreditType() ? 
            this._creditTypeWindow.y + this._creditTypeWindow.height :
            this._helpWindow.y + this._helpWindow.height;
        this._creditListWindow = new Window_CreditItemList(0, y);
        this._creditListWindow.setHandler('cancel',  this.cancelCreditList.bind(this));
        if (this.onCreditType()) this._creditTypeWindow.setWindow(this._creditListWindow);
        this.addWindow(this._creditListWindow);
    };

    Scene_Title.prototype.typeSelect = function() {
        this._creditListWindow.select(0);
        this._creditListWindow.activate();
    };

    Scene_Title.prototype.cancelCreditType = function() {
        this._helpWindow.close();
        this._creditTypeWindow.close();
        this._creditListWindow.close();
        this._commandWindow.open();
        this._commandWindow.activate();
    };

    Scene_Title.prototype.cancelCreditList = function() {
        if (this.onCreditType()) {
            this._creditTypeWindow.activate();
            this._creditListWindow.deselect();
        } else {
            this._helpWindow.close();
            this._creditListWindow.close();
            this._commandWindow.open();
            this._commandWindow.activate();
        }
    };

    /*-------------------------------------------------------------------------/
    // Window_CreditItemType
    /-------------------------------------------------------------------------*/
    function Window_CreditItemType() {
        this.initialize.apply(this, arguments);
    }

    Window_CreditItemType.prototype = Object.create(Window_HorzCommand.prototype);
    Window_CreditItemType.prototype.constructor = Window_CreditItemType;

    Window_CreditItemType.prototype.initialize = function(x, y) {
        this._itemTypes = [];
        if (!FTKR.TS.credit.itemList) FTKR.TS.credit.itemList = [];
        this._listNum = FTKR.TS.credit.itemList.filter( function(item){
                if (!this._itemTypes.contains(item.itemType)) {
                    this._itemTypes.push(item.itemType);
                    return true;
                }
            },this).length;
        Window_HorzCommand.prototype.initialize.call(this, x, y);
        this._openness = 0;
        this.close();
        this.deactivate();
    };
/*
    Window_CreditItemType.prototype.loadWindowskin = function() {
        Window_HorzCommand.prototype.loadWindowskin.call(this);
        this._openness = 0;
    };
*/
    Window_CreditItemType.prototype.setWindow = function(listWindow) {
        this._listWindow = listWindow;
    };

    Window_CreditItemType.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_CreditItemType.prototype.maxCols = function() {
        return Math.min(this._listNum, 4);
    };

    Window_CreditItemType.prototype.makeCommandList = function() {
        this._itemTypes.forEach( function(type){
            this.addCommand(FTKR.TS.typeName[type], 'type', true, type);
        },this);
    };

    Window_CreditItemType.prototype.update = function() {
        Window_HorzCommand.prototype.update.call(this);
        if (this._listWindow) {
            this._listWindow.setTypeId(this.currentExt());
        }
    };

    /*-------------------------------------------------------------------------/
    //Window_CreditItemList
    /-------------------------------------------------------------------------*/
    function Window_CreditItemList() {
        this.initialize.apply(this, arguments);
    }

    Window_CreditItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_CreditItemList.prototype.constructor = Window_CreditItemList;

    Window_CreditItemList.prototype.initialize = function(x, y, onCtype) {
        this._onCtype = onCtype;
        var width = this.windowWidth();
        var height = Graphics.boxHeight - y;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._openness = 0;
        this.close();
        this.refresh();
    };

    Window_CreditItemList.prototype.lineHeight = function() {
        return 24;
    };

    Window_CreditItemList.prototype.standardFontSize = function() {
        return 18;
    };

    Window_CreditItemList.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_CreditItemList.prototype.setTypeId = function(typeId) {
        if (this._typeId !== typeId) {
            this._typeId = typeId;
            this.refresh();
            this.resetScroll();
        }
    };

    Window_CreditItemList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    Window_CreditItemList.prototype.item = function() {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };

    Window_CreditItemList.prototype.makeItemList = function() {
        if (this._onCtype) {
            this._data = FTKR.TS.credit.itemList.filter(function(item) {
                return item && item.itemType == this._typeId;
            }, this);
        } else {
            this._data = FTKR.TS.credit.itemList.map(function(item) {
                return item;
            }, this);
        }
    };

    Window_CreditItemList.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_CreditItemList.prototype.itemHeight = function() {
        return this.lineHeight() * 5;
    };

    Window_CreditItemList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var dw = this.textWidth('00') * 5;
            var rect = this.itemRect(index);
            var h = this.lineHeight();
            var halfW = rect.width / 2;
            rect.width -= this.textPadding();
            //1行目
            this.changeTextColor(this.systemColor());
            this.drawText(' 素材名：', rect.x, rect.y, dw);
            this.resetTextColor();
            this.drawText(item.itemName, rect.x + dw, rect.y, halfW - dw);
            this.changeTextColor(this.systemColor());
            this.drawText(' 作者名：', rect.x + halfW, rect.y, dw);
            this.resetTextColor();
            this.drawText(item.authorName, rect.x + halfW + dw, rect.y, halfW - dw);
            //2行目
            this.changeTextColor(this.systemColor());
            this.drawText(' 來源：', rect.x, rect.y + h*1, dw);
            this.resetTextColor();
            this.drawText(item.itemLink, rect.x + dw, rect.y + h*1, rect.width - dw);
            //3-4行目
            this.changeTextColor(this.systemColor());
            this.drawText(' 説明：', rect.x, rect.y + h*2, rect.width);
            this.resetTextColor();
            this.drawTextEx(item.itemDesc, rect.x + dw, rect.y + h*2, rect.width - dw);
        }
    };

    /*-------------------------------------------------------------------------/
    // Window_TitleCommand
    /-------------------------------------------------------------------------*/

    Window_TitleCommand.prototype.makeCommandList = function() {
        var com = FTKR.TS.command;
        var credit = FTKR.TS.credit;
        this.addCommand(TextManager.newGame,   'newGame');
        if (com.continue) this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        if (com.option) this.addCommand(TextManager.options,   'options');
        if (credit && credit.enable) this.addCommand(credit.name, 'credit');
    };

    Window_TitleCommand.prototype.standardFontSize = function() {
        return FTKR.TS.window.fontsize;
    };

    Window_TitleCommand.prototype.standardPadding = function() {
        return FTKR.TS.window.padding;
    };

    Window_TitleCommand.prototype.lineHeight = function() {
        var height = FTKR.TS.window.lineHeight;
        return height ? height : FTKR.TS.window.fontsize + 8;
    };

    Window_TitleCommand.prototype.standardBackOpacity = function() {
        return FTKR.TS.window.opacity;
    };

    Window_TitleCommand.prototype._refreshFrame = function() {
        if (FTKR.TS.window.hideFrame) Window.prototype._refreshFrame.call(this);
    };

}());//EOF
