//=============================================================================
// 新增刪除指令來移除存檔的插件
// FTKR_DeleteSavefile.js
// プラグインNo : 69
// 作成者     : フトコロ
// 作成日     : 2018/02/25
// 最終更新日 : 2018/04/06
// バージョン : v1.0.4
//=============================================================================

var Imported = Imported || {};
Imported.FTKR_DSF = true;

var FTKR = FTKR || {};
FTKR.DSF = FTKR.DSF || {};

//=============================================================================
/*:
 * @plugindesc v1.0.4 新增刪除指令來移除存檔
 * @author フトコロ( 翻譯 : ReIris )
 *
 * @param --コマンド名--
 * @text --命令名稱--
 * @default
 * 
 * @param Save Command Name
 * @text 保存命令名稱
 * @desc 在保存畫面中的保存命令名稱
 * @default 保存
 *
 * @param Load Command Name
 * @text 讀取命令名稱
 * @desc 在讀取畫面的讀取命令名稱
 * @default 讀取
 *
 * @param Delete Command Name
 * @text 刪除命令名稱
 * @desc 將保存檔案刪除的命令名稱
 * @default 刪除
 *
 * @param --セーブファイル削除SE--
 * @text --保存刪除音效--
 * @default
 * 
 * @param Delete File Se
 * @text 刪除檔案音效
 * @desc 指定刪除檔案時播放的音效。沒有指定的情況將播放「OK」的音效。
 * @default 
 * @type struct<sound>
 * 
 * @param --削除確認--
 * @text --刪除確認--
 * @default
 * 
 * @param Enable Confirmation
 * @text 刪除時是否確認？
 * @desc 刪除時是否需要確認選擇。
 * @type boolean
 * @on 是
 * @off 否
 * @default true
 *
 * @param Conf Title Format
 * @text 確認標題格式
 * @desc 刪除存檔時的確認視窗內容
 *  %1 - 檔案 / %2 - 檔案ID   (可以使用控制字元)
 * @default 要刪除 %1%2 嗎？
 * 
 * @param Confirmation Ok Format
 * @text 確認格式
 * @desc 確認命令「是」的顯示內容。
 * @default 是
 *
 * @param Confirmation Cancel Format
 * @text 取消格式
 * @desc 確認命令「否」的顯示內容。
 * @default 否
 *
 * @param Enable Conf Window Setting
 * @text 確認視窗設定
 * @desc 將確認視窗與保存畫面分開設定的功能。
 * @type boolean
 * @on 使用
 * @off 不使用
 * @default false
 *
 * @param Conf Window Setting
 * @text 確認視窗設定
 * @desc 使用確認視窗的設定。
 * @default 
 * @type struct<window>
 * 
 * @help 
 *-----------------------------------------------------------------------------
 * 摘要
 *-----------------------------------------------------------------------------
 * 在保存跟讀取畫面中刪除存檔。
 * 
 * 刪除時將會顯示確認視窗。
 * 
 * 
 * 在參數中可以設定以下內容。
 * 1. 顯示的命令名稱
 * 2. 刪除時的音效
 * 3. 刪除時顯示的確認視窗內容。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 設定方法
 *-----------------------------------------------------------------------------
 * 1. 於「插件管理器」中，追加本插件。
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
 * 変更来歴
 *-----------------------------------------------------------------------------
 * 
 * v1.0.4 - 2018/04/06 : 仕様変更
 *    1. プラグインパラメータが空欄だった場合の処理を一部見直し。
 * 
 * v1.0.3 - 2018/04/04 : 不具合修正
 *    1. windowskinを変更した場合に、初回表示時に反映されない不具合を修正。
 * 
 * v1.0.2 - 2018/04/03 : 機能追加
 *    1. 削除でファイルを選択した時に決定SEを鳴らすように変更。
 *    2. 確認画面のウィンドウを個別に設定する機能を追加。
 * 
 * v1.0.1 - 2018/03/01 : 仕様変更
 *    1. 確認画面でカーソルの初期位置を「実行しない」に変更。
 * 
 * v1.0.0 - 2018/02/25 : 初版作成
 * 
 *-----------------------------------------------------------------------------
*/
//=============================================================================
/*~struct~sound:
 * @param name
 * @text 名稱
 * @desc 指定音效名稱。
 * @default Decision1
 * @type file
 * @require 1
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @desc 指定音效音量。
 * @default 90
 * @type number
 * @max 100
 * 
 * @param pitch
 * @text 音調
 * @desc 指定音效音調。
 * @default 100
 * @type number
 * @max 150
 * @min 50
 * 
 * @param pan
 * @text 移動
 * @desc 指定音效位相。
 * @default 0
 * @type number
 * @max 100
 * @min -100
 *
*/
/*~struct~window:
 * @param windowskin
 * @text 視窗樣式
 * @desc 指定視窗樣式的圖片。留白的情況會使用預設圖片。
 * @default Window
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param width
 * @text 寬度
 * @desc 視窗的寬度設定。
 * @default 544
 * @type number
 * @min 1
 *
 * @param opacity
 * @text 透明度
 * @desc 指定視窗背景的透明度(0 - 255)。0 為透明。
 * @default 192
 * @type number
 * @min 0
 * @max 255
 *
 * @param frame
 * @text 視窗邊框
 * @desc 視窗的邊框是否顯示。
 * @type boolean
 * @on 顯示
 * @off 不顯示
 * @default true
 *
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
    var parameters = PluginManager.parameters('FTKR_DeleteSavefile');

    FTKR.DSF = {
        save     : String(parameters['Save Command Name'] || 'セーブ'),
        load     : String(parameters['Load Command Name'] || 'ロード'),
        delete   : String(parameters['Delete Command Name'] || '削除'),
        deleteSe : paramParse(parameters['Delete File Se']),
        conf     : {
            enabled : paramParse(parameters['Enable Confirmation']) || false,
            title : String(parameters['Conf Title Format'] || ''),
            ok    : String(parameters['Confirmation Ok Format'] || ''),
            cancel: String(parameters['Confirmation Cancel Format'] || ''),
            setting : paramParse(parameters['Conf Window Setting']) || {},
        }
    };
    FTKR.DSF.conf.setting.enabled = paramParse(parameters['Enable Conf Window Setting']) || false;

    SoundManager.playDeleteSavefile = function() {
        var sound = FTKR.DSF.deleteSe;
        if (sound && sound.name) {
            AudioManager.playStaticSe(sound);
        } else {
            this.playSystemSound(1);
        }
    };

    //=============================================================================
    // Scene_Boot
    //=============================================================================

    var _DSF_Scene_Boot_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;
    Scene_Boot.prototype.loadSystemWindowImage = function() {
        _DSF_Scene_Boot_loadSystemWindowImage.call(this);
        var set = FTKR.DSF.conf.setting;
        if (set.enabled && set.windowskin) {
            if (!!ImageManager.reserveSystem) {
                ImageManager.reserveSystem(set.windowskin);
            } else {
                ImageManager.loadSystem(set.windowskin);
            }
        }
    };

    //=============================================================================
    // Scene_File
    //=============================================================================
    //書き換え
    Scene_File.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createCommandWindow();
        this.createListWindow();
        if (FTKR.DSF.conf.enabled) {
            this.createDsdConfWindows();
        }
    };

    Scene_File.prototype.createCommandWindow = function() {
        var x = 0;
        var y = this._helpWindow.height;
        this._commandWindow = new Window_SavefileCommand(x, y, this.mode());
        this._commandWindow.setHandler('list',   this.onListOk.bind(this));
        this._commandWindow.setHandler('delete', this.onDeleteOk.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    //書き換え
    Scene_File.prototype.createListWindow = function() {
        var x = 0;
        var y = this._commandWindow.y + this._commandWindow.height;
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._listWindow = new Window_SavefileList(x, y, width, height);
        this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
        this._listWindow.setHandler('cancel', this.onSavefileCancel.bind(this));
        this._listWindow.select(this.firstSavefileIndex());
        this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
        this._listWindow.setMode(this.mode());
        this._listWindow.refresh();
        this._listWindow.deactivate();
        this._listWindow.deselect();
        this.addWindow(this._listWindow);
    };

    Scene_File.prototype.createDsdConfWindows = function() {
        this.createDsdConfTitle();
        this.createDsdConfCommand();
    }

    Scene_File.prototype.createDsdConfTitle = function() {
        var wx = FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.width ? (Graphics.boxWidth - FTKR.DSF.conf.setting.width) / 2 : Graphics.boxWidth / 6;
        var wy = Graphics.boxHeight / 2 - this._helpWindow.fittingHeight(1);
        this._confTitleWindow = new Window_DsdConfTitle(wx, wy);
        this.addWindow(this._confTitleWindow);
        this._confTitleWindow.hide();
    };

    Scene_File.prototype.createDsdConfCommand = function() {
        var wx = this._confTitleWindow.x;
        var wy = this._confTitleWindow.y + this._confTitleWindow.height;
        this._confCommandWindow = new Window_DsdConf(wx, wy);
        this._confCommandWindow.setHandler('delete', this.onConfirmationOk.bind(this));
        this._confCommandWindow.setHandler('cancel', this.onConfirmationCancel.bind(this));
        this.addWindow(this._confCommandWindow);
        this._confCommandWindow.hide();
    };

    Scene_File.prototype.onListOk = function() {
        this._delete = false;
        this._commandWindow.deactivate();
        this._listWindow.activate();
        this._listWindow.select(0);
    }

    Scene_File.prototype.onDeleteOk = function() {
        this._delete = true;
        this._commandWindow.deactivate();
        this._listWindow.activate();
        this._listWindow.select(0);
    };

    Scene_File.prototype.onSavefileCancel = function() {
        this._delete = false;
        this._listWindow.deselect();
        this._commandWindow.activate();
    };

    Scene_File.prototype.deleteSavefile = function() {
        if (FTKR.DSF.conf.enabled) {
            this._confTitleWindow.setSavefileId(this.savefileId());
            this._confTitleWindow.show();
            this._confCommandWindow.show();
            this._confCommandWindow.activate();
            this._confCommandWindow.select(1);
        } else {
            SoundManager.playDeleteSavefile();
            StorageManager.remove(this.savefileId());
            this._listWindow.refresh();
            this._listWindow.activate();
        }
    };

    Scene_File.prototype.onConfirmationOk = function() {
        SoundManager.playDeleteSavefile();
        StorageManager.remove(this.savefileId());
        this._listWindow.refresh();
        this._listWindow.activate();
        this._confTitleWindow.hide();
        this._confCommandWindow.deactivate();
        this._confCommandWindow.hide();
      };

    Scene_File.prototype.onConfirmationCancel = function() {
        this._confTitleWindow.hide();
        this._confCommandWindow.deactivate();
        this._confCommandWindow.hide();
        this._listWindow.activate();
    };

    //=============================================================================
    // Scene_Save
    //=============================================================================
    var _DSF_Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function() {
        if (this._delete) {
            if (DataManager.isThisGameFile(this.savefileId())) {
                SoundManager.playOk();
                this.deleteSavefile();
            } else {
                this.onSaveFailure();
            }
        } else {
            _DSF_Scene_Save_onSavefileOk.call(this);
        }
    };

    //=============================================================================
    // Scene_Load
    //=============================================================================
    var _DSF_Scene_Load_onSavefileOk = Scene_Load.prototype.onSavefileOk;
    Scene_Load.prototype.onSavefileOk = function() {
        if (this._delete) {
            if (DataManager.isThisGameFile(this.savefileId())) {
                SoundManager.playOk();
                this.deleteSavefile();
            } else {
                this.onLoadFailure();
            }
        } else {
            _DSF_Scene_Load_onSavefileOk.call(this);
        }
    };

    //=============================================================================
    // Window_SavefileCommand
    //=============================================================================
    function Window_SavefileCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_SavefileCommand.prototype = Object.create(Window_HorzCommand.prototype);
    Window_SavefileCommand.prototype.constructor = Window_SavefileCommand;

    Window_SavefileCommand.prototype.initialize = function(x, y, mode) {
        this._mode = mode;
        Window_HorzCommand.prototype.initialize.call(this, x, y);
    };

    Window_SavefileCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_SavefileCommand.prototype.maxCols = function() {
        return 2;
    };

    Window_SavefileCommand.prototype.makeCommandList = function() {
        var listname = this._mode === 'save' ? FTKR.DSF.save : FTKR.DSF.load;
        this.addCommand(listname,        'list');
        this.addCommand(FTKR.DSF.delete, 'delete', this.isDeleteFileEnabled());
    };

    Window_SavefileCommand.prototype.isDeleteFileEnabled = function() {
        return DataManager.isAnySavefileExists();
    };

    //=============================================================================
    // Window_DsdConfTitle
    //=============================================================================

    function Window_DsdConfTitle() {
        this.initialize.apply(this, arguments);
    }

    Window_DsdConfTitle.prototype = Object.create(Window_Base.prototype);
    Window_DsdConfTitle.prototype.constructor = Window_DsdConfTitle;

    Window_DsdConfTitle.prototype.initialize = function(x, y) {
        var set = FTKR.DSF.conf.setting;
        var width = set.enabled && set.width ? set.width : Graphics.boxWidth * 2 / 3;
        var height = this.fittingHeight(1);
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        if (set.enabled && !set.frame) this.margin = 0;
        this._savefileId = 0;
        this.refresh();
    };

    Window_DsdConfTitle.prototype.setSavefileId = function(savefileId) {
        this._savefileId = savefileId;
        this.refresh();
    }

    Window_DsdConfTitle.prototype.refresh = function () {
        this.contents.clear();
        var text = FTKR.DSF.conf.title.format(TextManager.file, this._savefileId);
        this.drawTextEx(text, 0, 0);
    };

    Window_DsdConfTitle.prototype.loadWindowskin = function() {
        if (FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.windowskin) {
            this.windowskin = ImageManager.loadSystem(FTKR.DSF.conf.setting.windowskin);
        } else {
            Window_Base.prototype.loadWindowskin.call(this);
        }
    };

    Window_DsdConfTitle.prototype.standardBackOpacity = function() {
        if (FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.opacity >= 0) {
            return Number(FTKR.DSF.conf.setting.opacity);
        } else {
            return Window_Base.prototype.standardBackOpacity.call(this);
        }
    };

    Window_DsdConfTitle.prototype._refreshFrame = function() {
        if (FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.frame) Window.prototype._refreshFrame.call(this);
    };

    //=============================================================================
    // Window_DsdConf
    //=============================================================================

    function Window_DsdConf() {
        this.initialize.apply(this, arguments);
    }

    Window_DsdConf.prototype = Object.create(Window_HorzCommand.prototype);
    Window_DsdConf.prototype.constructor = Window_DsdConf;

    Window_DsdConf.prototype.initialize = function(x, y) {
        Window_HorzCommand.prototype.initialize.call(this, x, y);
        if (FTKR.DSF.conf.setting.enabled && !FTKR.DSF.conf.setting.frame) this.margin = 0;
    };

    Window_DsdConf.prototype.windowWidth = function() {
        return FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.width ? FTKR.DSF.conf.setting.width : Graphics.boxWidth * 2 / 3;
    };

    Window_DsdConf.prototype.maxCols = function() {
        return 2;
    };

    Window_DsdConf.prototype.makeCommandList = function() {
        this.addCommand(FTKR.DSF.conf.ok, 'delete');
        this.addCommand(FTKR.DSF.conf.cancel, 'cancel');
    };

    Window_DsdConf.prototype.loadWindowskin = function() {
        if (FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.windowskin) {
            this.windowskin = ImageManager.loadSystem(FTKR.DSF.conf.setting.windowskin);
        } else {
            Window_Base.prototype.loadWindowskin.call(this);
        }
    };

    Window_DsdConf.prototype.standardBackOpacity = function() {
        if (FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.opacity >= 0) {
            return Number(FTKR.DSF.conf.setting.opacity);
        } else {
            return Window_Base.prototype.standardBackOpacity.call(this);
        }
    };

    Window_DsdConf.prototype._refreshFrame = function() {
        if (FTKR.DSF.conf.setting.enabled && FTKR.DSF.conf.setting.frame) Window.prototype._refreshFrame.call(this);
    };

}());//EOF
