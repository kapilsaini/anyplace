/*
 *
 *
 */
package db_models

import java.io.IOException
import java.util
import java.util.HashMap
import utils.LPUtils

import com.couchbase.client.java.document.json.JsonObject

class AccessPoint(hm: HashMap[String, String]) extends AbstractModel {

    private var json: JsonObject = _

    this.fields = hm

    def this() {
        this(new util.HashMap[String, String]())
        fields.put("ssid", "")
        fields.put("buid", "")
        fields.put("floor", "")
        fields.put("apid", "")
    }

    def this(ssid: String , buid: String, floor: String) {
        this()
        fields.put("ssid", ssid)
        fields.put("buid", buid)
        fields.put("floor", floor)
        this.json = json
    }

    def getId(): String = {
        var apid: String = fields.get("apid")
        if (apid == null || apid.isEmpty || apid == "") {
          val finalId = LPUtils.getRandomUUID + "_" + System.currentTimeMillis()
          fields.put("apid", "apid_" + finalId)
          apid = fields.get("apid")
        }
        apid
    }


    def toValidCouchJson(): JsonObject = {
        JsonObject.from(this.getFields())
    }

    def toCouchGeoJSON(): String = {
     ""
    }

    override def toString(): String = toValidCouchJson().toString
}
