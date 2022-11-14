ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

RegisterServerEvent('area_pr:updatedata')
AddEventHandler('area_pr:updatedata', function()
    local _source = source
	if _source then
		local playerdata = Getdata(source)
		TriggerClientEvent('area_pr:getprofiledata', _source, playerdata)
	end
end)

AddEventHandler('esx:playerLoaded', function(source)
	Citizen.Wait(5000)
	local _source = source
	if _source then
		local playerdata = Getdata(source)
		TriggerClientEvent('area_pr:getprofiledata', _source, playerdata)
	end
end)

RegisterServerEvent('area_pr:onbuyitem')
AddEventHandler('area_pr:onbuyitem', function(itemdata,cata,count)
	local _source = source
	if _source then
		local xPlayer = ESX.GetPlayerFromId(_source)
		local cash = xPlayer.getAccount('black_money').money
		local point = Getpoint(_source)
		local tier = Gettier(_source)
		if cata == "items" then
			for k,v in pairs(Config.Shop.Items) do
				if itemdata == v.item then
					local allprice = v.price * count
					local needcash = allprice - cash
					if cash >= allprice then
						if v.itemtype == "item" then
							xPlayer.removeAccountMoney('black_money', allprice)
							xPlayer.addInventoryItem(v.item, count)
							local newcash = xPlayer.getAccount('black_money').money
							TriggerClientEvent('area_pr:updatacash', _source, newcash)
							TriggerClientEvent('area_pr:alerttext', _source, "success","ซื้อไอเทม "..v.label.." สำเร็จ")
							Addrewardpoint(_source,allprice)
						elseif v.itemtype == "weapon" then
							if count >= "1" then
								if xPlayer.hasWeapon(v.item) then
									TriggerClientEvent('area_pr:alerttext', _source, "warning","ผู้เล่นมีอาวุธชิ้นนี้อยู่แล้ว")
								else
									xPlayer.removeAccountMoney('black_money', allprice)
									xPlayer.addWeapon(v.item, 1)
									local newcash = xPlayer.getAccount('black_money').money
									TriggerClientEvent('area_pr:updatacash', _source, newcash)
									TriggerClientEvent('area_pr:alerttext', _source, "success","ซื้อไอเทม "..v.label.." สำเร็จ")
									Addrewardpoint(_source,allprice)
								end
							else
								TriggerClientEvent('area_pr:alerttext', _source, "warning","สามารซื้ออาวุธได้เพียง 1 ชิ้น")
							end
						elseif v.itemtype == "weapon_addon" then
							if count == "1" then
								local itemcount = xPlayer.getInventoryItem(v.item).count
								if itemcount >= 1 then
									TriggerClientEvent('area_pr:alerttext', _source, "warning","ผู้เล่นมีอาวุธชิ้นนี้อยู่แล้ว")
								else
									xPlayer.removeAccountMoney('black_money', allprice)
									xPlayer.addInventoryItem(v.item, 1)
									local newcash = xPlayer.getAccount('black_money').money
									TriggerClientEvent('area_pr:updatacash', _source, newcash)
									TriggerClientEvent('area_pr:alerttext', _source, "success","ซื้อไอเทม "..v.label.." สำเร็จ")
									Addrewardpoint(_source,allprice)
								end
							else
								TriggerClientEvent('area_pr:alerttext', _source, "warning","สามารซื้ออาวุธได้เพียง 1 ชิ้น")
							end
						end
					else
						print ("need "..needcash.." cash")
						TriggerClientEvent('area_pr:alerttext', _source, "warning","ต้องการเงินอีก "..needcash.."")
					end
				end
			end
		elseif cata == "reward" then
			for k,v in pairs(Config.Shop.Reward) do
				if itemdata == v.item then
					local needpoint = v.price - point
					if point >= v.price then
						if tier < v.tier then
							if v.tier == tier + 1 then
								if v.itemtype == "item" then
									xPlayer.addInventoryItem(v.item, 1)
									Settier(_source, v.tier)
									TriggerClientEvent('area_pr:alerttext', _source, "success","รับไอเทม "..v.label.." สำเร็จ")
								elseif v.itemtype == "weapon" then
										if xPlayer.hasWeapon(v.item) then
											TriggerClientEvent('area_pr:alerttext', _source, "warning","ผู้เล่นมีอาวุธชิ้นนี้อยู่แล้ว")
										else
											xPlayer.addWeapon(v.item, 1)
											Settier(_source, v.tier)
											TriggerClientEvent('area_pr:alerttext', _source, "success","รับไอเทม "..v.label.." สำเร็จ")
										end
								elseif v.itemtype == "weapon_addon" then
									local itemcount = xPlayer.getInventoryItem(v.item).count
									if itemcount >= 1 then
										TriggerClientEvent('area_pr:alerttext', _source, "warning","ผู้เล่นมีอาวุธชิ้นนี้อยู่แล้ว")
									else
										xPlayer.addInventoryItem(v.item, 1)
										Settier(_source, v.tier)
										TriggerClientEvent('area_pr:alerttext', _source, "success","รับไอเทม "..v.label.." สำเร็จ")
									end
								end
							else
								TriggerClientEvent('area_pr:alerttext', _source, "warning","กรุณารับของตามลำดับ")
							end
						else
							TriggerClientEvent('area_pr:alerttext', _source, "warning","คุณเคยรับไอเทมชิ้นนี้ไปแล้ว")
						end
					else
						TriggerClientEvent('area_pr:alerttext', _source, "warning","ต้องการแต้มสะสมอีก "..needpoint.."")
					end
				end
			end
		end
	end
end)


function Addrewardpoint(player, point)
	local _source = player
	local xPlayer = ESX.GetPlayerFromId(_source)
	local Addpoint = point
	if xPlayer ~= nil then
		local result = MySQL.Sync.fetchAll("SELECT users.rewardpoint FROM users WHERE users.identifier = @identifier", {
			['@identifier'] = xPlayer.identifier
		})
		if result ~= nil and result[1] ~= nil then
			local Currentpoint = result[1].rewardpoint
			local totalpoint = Currentpoint + Addpoint
			MySQL.Async.execute('UPDATE users SET rewardpoint = @point WHERE identifier = @identifier', {
					['@identifier'] = xPlayer.identifier,
					['@point'] = totalpoint
				}, function(result)
			end)
			TriggerClientEvent('area_pr:updatepoint', _source, totalpoint)
			TriggerClientEvent('area_pr:alerttext', _source, "success","ได้รับคะแนนสะสม "..math.floor(Addpoint).." แต้ม คะแนนรวม "..math.floor(totalpoint).." แต้ม")
		end
	end
end

function Getpoint(player)
	local _source = player
	local xPlayer = ESX.GetPlayerFromId(_source)
	if xPlayer ~= nil then
		local result = MySQL.Sync.fetchAll("SELECT users.rewardpoint FROM users WHERE users.identifier = @identifier", {
			['@identifier'] = xPlayer.identifier
		})
		if result ~= nil and result[1] ~= nil then
			return result[1].rewardpoint
		end
		return 0
	end
end

function Settier(player,tier)
	local _source = player
	local xPlayer = ESX.GetPlayerFromId(_source)
	local tierset = tier
	if xPlayer ~= nil then
		local result = MySQL.Sync.fetchAll("SELECT users.rewardtier FROM users WHERE users.identifier = @identifier", {
			['@identifier'] = xPlayer.identifier
		})
		if result ~= nil and result[1] ~= nil then
			MySQL.Async.execute('UPDATE users SET rewardtier = @settier WHERE identifier = @identifier', {
					['@identifier'] = xPlayer.identifier,
					['@settier'] = tierset
				}, function(result)
			end)
			TriggerClientEvent('area_pr:updatetier', _source, tierset)
		end
	end
end

function Gettier(player)
	local _source = player
	local xPlayer = ESX.GetPlayerFromId(_source)
	if xPlayer ~= nil then
		local result = MySQL.Sync.fetchAll("SELECT users.rewardtier FROM users WHERE users.identifier = @identifier", {
			['@identifier'] = xPlayer.identifier
		})
		if result ~= nil and result[1] ~= nil then
			return result[1].rewardtier
		end
		return 0
	end
end

function Getdata(source)
	local _source = source
	if _source then
		local xPlayer = ESX.GetPlayerFromId(_source)
		local avatar = GetAvatar(_source)
		local name = xPlayer.getName()
		local blackmoney = xPlayer.getAccount('black_money').money
		local rewardpoint = Getpoint(_source)
		local rewardtier = Gettier(_source)
		local indexplayer = {Name = name,Image = avatar,Cash = blackmoney,point = rewardpoint,tier = rewardtier}
		return indexplayer
	end
end

function GetAvatar(source)
    local source = source
    local image = nil
    local steamhex = GetPlayerIdentifier(source, 0)
    if steamhex ~= nil and steamhex ~= '' then
        local steamid = tonumber(string.gsub(steamhex, 'steam:', ''), 16)
        if steamid ~= nil then
            PerformHttpRequest('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' .. GetConvar('steam_webApiKey') .. '&steamids=' .. steamid, function(e, data, h)
                local data = json.decode(data) or {}
                if data and data.response and data.response.players[1] then
                    avatar = data.response.players[1].avatarfull
                    if avatar ~= nil then
                        image = avatar
                    end
                end
            end)
        end
        local c = 0
        while steamid ~= nil and image == nil and c < 100 do 
			c = c + 1 
			Wait(1) 
		end
        if image == nil then 
			image = 'https://ui-avatars.com/api/?name='..GetPlayerName(_source)..''
		end return image
    else
        return 'https://ui-avatars.com/api/?name='..GetPlayerName(_source)..''
    end
end