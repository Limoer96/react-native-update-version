package com.reactnativeupdateversion
import android.util.Log
import com.azhon.appupdate.listener.OnDownloadListenerAdapter
import com.azhon.appupdate.manager.DownloadManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import kotlin.math.roundToInt

class UpdateVersionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "UpdateVersion"
    }
    private var manager: DownloadManager? = null
    private var lastPercent: Int = 0
    @ReactMethod
    fun update(config: ReadableMap) {
      val url = if(config.hasKey("url")) config.getString("url") else ""
      val apkName = if(config.hasKey("apkName")) config.getString("apkName") else "update.apk"
      manager = DownloadManager.Builder(currentActivity!!).run {
        if (url.isNullOrEmpty() || apkName.isNullOrEmpty()) {
          return
        }
        apkUrl(url)
        apkName(apkName)
        smallIcon(R.mipmap.ic_launcher)
        onDownloadListener(listenerAdapter)
        build()
      }
      manager!!.download()
    }
    @ReactMethod
    fun cancel() {
      if (manager != null) {
        manager!!.cancel()
      }
    }
    private fun sendEvent(ctx: ReactContext, eventName: String, data: WritableMap?) {
      ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, data)
    }
    private val listenerAdapter: OnDownloadListenerAdapter = object : OnDownloadListenerAdapter() {
      override fun downloading(max: Int, progress: Int) {
        super.downloading(max, progress)
        val currentPercent = progress.div(max.toDouble()).times(100).roundToInt()
        val data: WritableMap = Arguments.createMap()
        data.putInt("percent", currentPercent)
        data.putInt("progress", progress)
        data.putInt("max", max)
        if (currentPercent != lastPercent) {
          sendEvent(reactContext, "downloadProgress", data)
        }
        lastPercent = currentPercent
      }

      override fun done(apk: File) {
        super.done(apk)
        val data = Arguments.createMap()
        data.putInt("percent", 100)
        data.putString("apkPath", apk.path)
        sendEvent(reactContext, "downloadProgress", data)
      }

      override fun error(e: Throwable) {
        super.error(e)
        val data = Arguments.createMap()
        data.putString("message", e.message)
        sendEvent(reactContext, "error", data)
      }
    }
    }
