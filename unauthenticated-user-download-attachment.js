/**
 * SCRIPTED REST (GET)
 * Use-case: Unauthenticated (public) users should be able to download attachments.
 * Warning: Security needs to be adjusted
 * On the front-end, hit the endpoint with params: sys_id, file_name (encoded using encodeURI())
 * Warning: This script should be limited in usage. You can limit it per table as well. In most cases, I don't recommend opening up attachments. This is a last resort.
 */

(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
    var params = request.queryParams;
    var sys_id = params.sys_id;
    var file_name = decodeURI(params.file_name); // you can get this from the attachment name, but this is more flexible. the param needs to be encoded.

    var url =
        gs.getProperty("glide.servlet.uri") +
        "sys_attachment.do?sys_id=" +
        sys_id;

    var req = new sn_ws.RESTMessageV2();
    req.setEndpoint(url);
    req.setHttpMethod("GET");

    var attachment = new GlideRecord("sys_attachment");
    attachment.get(sys_id);
    if (attachment) {
        var content_type = "application/download"; // if you have a specific filetype, specify it here. or else, the filename will set the extension.
        var user = "<USERNAME>";
        var password = "<PASSWORD>";
        req.setBasicAuth(user, password);
        req.setRequestHeader("Accept", content_type);
        var res = req.execute();

        if (res.getStatusCode() == 200) {
            var hdrs = {};
            hdrs["Content-Type"] = content_type;
            hdrs["Content-Disposition"] = "attachment; filename=" + file_name;

            response.setContentType(content_type);
            response.setStatus(200);
            response.setHeaders(hdrs);

            var gsa = new GlideSysAttachment();
            var attachmentStream = new gsa.getContentStream(sys_id);
            var writer = response.getStreamWriter();
            writer.writeStream(attachmentStream);
        } else {
            return new sn_ws_err.NotFoundError(
                "File Not Found - Credentials Issue or CSV Webservice Issue"
            );
        }
    }
})(request, response);
