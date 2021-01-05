local http = require "resty.http"
local cjson = require "cjson.safe"

local _M = {}

function _M.execute(conf)
    local ok, err
    local scheme, host, port, _ = unpack(http:parse_uri(conf.auth_uri))

    local client = http.new()
    client:set_timeout(conf.timeout)
    client:connect(host, port)

    -- if uri protocol is https then create a three handshake before send the requst
    if scheme == "https" then
        local ok, err = client:ssl_handshake()
        if not ok then
            kong.log.err(err)
            return kong.response.exit(500, {message = "An unexpected error occurred"})
        end
    end

    -- get new http options to send it to auth service
    local auth_request_options =
        _M.new_auth_request(conf.origin_request_headers_to_forward_to_auth, conf.keepalive_timeout)

    -- send a http request
    local res, err = client:request_uri(conf.auth_uri, auth_request_options)

    if not res then
        -- check the existance of the response
        kong.log.err(err)
        return kong.response.exit(500, {message = "An unexpected error occurred"})
    end

    if res.status == 200 then
        -- if resoponse status from auth service was 200 then attach authUser data
        -- to client requested body
        local temp = _M.new_body(res)
        kong.service.request.set_body(temp, "application/json")
    end

    if res.status > 299 then
        -- if resoponse status from auth service was greater than 299 then kong gateway pass
        -- the response to the client
        return kong.response.exit(res.status, res.body)
    end

    for _, name in ipairs(conf.auth_response_headers_to_forward) do
        if res.headers[name] then
            kong.service.request.set_header(name, res.headers[name])
        end
    end
end

function _M.new_body(response)
    -- this method take a response from auth service then attach the response to the
    -- client requested body
    local temp = {}
    local body, err, mimetype = kong.request.get_body()
    if mimetype == "application/json" then
        if body and type(body) == "table" then
            temp = body
        end
        temp["authUser"] = cjson.decode(response.body).data.user
    else
        temp = body
    end
    return temp
end

function _M.new_auth_request(origin_request_headers_to_forward_to_auth, keepalive_timeout)
    -- this method create an options for an http request to auth service
    -- this method taken a field for example authorization field from header along with
    -- its method and path an form a new created options
    local headers = {
        charset = "utf-8",
        ["content-type"] = "application/json"
    }

    local request_path = kong.request.get_path()
    local request_method = kong.request.get_method()
    local body = {
        method = request_method,
        uri = request_path
    }

    -- get the data from (schema.lua) database and set it to headers and body
    for _, name in ipairs(origin_request_headers_to_forward_to_auth) do
        local header_val = kong.request.get_header(name)
        if header_val then
            headers[name] = header_val
            body[name] = header_val
        end
    end
    return {
        method = "POST",
        headers = headers,
        body = cjson.encode(body),
        keepalive_timeout = keepalive_timeout
    }
end

return _M
