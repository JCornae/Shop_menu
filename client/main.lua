ESX = nil
profileindex = nil

Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
        Citizen.Wait(0)
    end
    Wait(1000)
	TriggerServerEvent('area_pr:updatedata')
end)

RegisterNetEvent('area_pr:getprofiledata')
AddEventHandler('area_pr:getprofiledata', function(data)
	profileindex = data
	print("^2[AREA] ^7Loading ^3"..GetCurrentResourceName().."")
end)

RegisterNetEvent('area_pr:updatacash')
AddEventHandler('area_pr:updatacash', function(datacash)
	profileindex.Cash = datacash
	SetNuiFocus(true,true)
	SendNUIMessage({
		type = "update",
		display = true,
		blackmoney = profileindex.Cash
	})
end)

RegisterNetEvent('area_pr:updatepoint')
AddEventHandler('area_pr:updatepoint', function(point)
	profileindex.point = point
	SetNuiFocus(true,true)
	local rewardList = Config.Shop.Reward
	for k,v in pairs(Config.Shop.Reward) do
		if v.last then
			lastrewardprice = v.price
		end
		if v.tier > profileindex.tier then
			v.claimed = false
		else
			v.claimed = true
		end
	end
	SendNUIMessage({
		type = "update",
		display = true,
		rewardpoint = profileindex.point,
		rewardList = rewardList
	})
end)


RegisterNetEvent('area_pr:updatetier')
AddEventHandler('area_pr:updatetier', function(tier)
	profileindex.tier = tier
	SetNuiFocus(true,true)
	local rewardList = Config.Shop.Reward
	for k,v in pairs(Config.Shop.Reward) do
		if v.tier > profileindex.tier then
			v.claimed = false
		else
			v.claimed = true
		end
	end
	print(ESX.DumpTable(rewardList))
	SendNUIMessage({
		type = "update",
		display = true,
		rewardtier = profileindex.tier,
		rewardList = rewardList,
		rewardpoint = profileindex.point
	})
end)


RegisterNetEvent('area_pr:toggleui')
AddEventHandler('area_pr:toggleui', function(value)
	if value == true then
		openui()
	else
		closeui()
	end
end)

RegisterNetEvent('area_pr:alerttext')
AddEventHandler('area_pr:alerttext', function(alt,tx)
	print("type "..alt.."")
	print("text "..tx.."")
	SendNUIMessage({
		display = true,
		type = "alert",
		showtype = alt,
		text = tx
	})
end)

RegisterCommand("area_pr_command",
function()
	if profileindex then
		openui()
	end
end)


RegisterKeyMapping("area_pr_command", "Shop command key", "keyboard", "I")


function openui()
		local shopitemlist = Config.Shop.Items
		local weaponList = Config.Shop.Weapon
		local fashionList = Config.Shop.Fashion
		local gachaList = Config.Shop.Gacha
		local rewardList = Config.Shop.Reward
		for k,v in pairs(Config.Shop.Reward) do
			if v.last then
				lastrewardprice = v.price
			end
			if v.tier > profileindex.tier then
				v.claimed = false
			else
				v.claimed = true
			end
		end
		--print(ESX.DumpTable(rewardList))
		SetNuiFocus(true,true)
		SendNUIMessage({
			type = "ui",
			display = true,
			name = profileindex.Name,
			avatar = profileindex.Image,
			blackmoney = profileindex.Cash,
			URL_Images = Config_SETUP_Shop.URL_Images,
			itemdata = shopitemlist,
			weaponList = weaponList,
			fashionList = fashionList,
			gachaList = gachaList,
			rewardList = rewardList, ---รายชื่อของ reward
			rewardpoint = profileindex.point,  ---จำนวน point ของผู้เล่น
			lastrewardprice = lastrewardprice, ---ราคาสูงสุดของ reward
			rewardtier = profileindex.tier ---ระดับ reward ของผู้เล่นตอนนี้
		})
end

function closeui()
    SendNUIMessage({
        display = false
    })
    SetNuiFocus(false,false)
end

RegisterNUICallback("disable", function()
    closeui()
end)

RegisterNUICallback("Onbuyitem", function(data)
	print(data.cata)
	TriggerServerEvent('area_pr:onbuyitem', data.name, data.cata, data.count)
end)