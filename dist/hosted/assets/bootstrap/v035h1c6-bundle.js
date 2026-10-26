/* H1B2 bundled source: v034d0.js */
/* V0.34D0 -- multi-file source foundation, reproducible dual build and CSV V2.
 * No simulation/historical patch rules are changed by D0.
 * The build embeds SCHEMA_V2 as JSON; the source file is build-time only.
 */
(function(NS){'use strict';
const VERSION='V0.34D0',PREVIOUS='V0.34C1H',SAVE_KEY='village-observer-v034d0';
const SCHEMA_V2={"columnCount":1683,"duplicateNames":72,"duplicateExtraColumns":72,"originalColumns":["simTime","ordinalDay","reason","note","village","status","brain","population","avgHealth","avgHappiness","food","foodReserveDays","wood","stone","gold","territoryTiles","technologyCount","researchTarget","totalKnowledge","tradeCount","tradeFood","tradeWood","tradeStone","recoveryMode","recoveryManualFood","recoveryManualWood","recoveryManualStone","salvagedWood","salvagedStone","dismantledBuildings","navigationLevel","harbors","buildingsInactive","buildingConditionAvg","foodCrisisDays","priceFoodAvg","priceWoodAvg","priceStoneAvg","buildSpaceUsed","buildSpaceDeveloped","buildSpacePotential","marketKnowledgeCount","landDevelopmentActive","buildingUpgradeActive","productionFood30","productionWood30","productionStone30","productionFood120","productionWood120","productionStone120","festivalCount","festivalGoldSpent","merchantGuilds","grandMarkets","deepQuarries","stoneworks","commercialCapacity120","commercialVolume120","commercialUtilization","frontierProjects","frontierProjectCap","commuters","quarryWorkerSlots","quarryWorkers","matureFrontierSettlements","eligibleFrontierSettlements","frontierSurplusAdults","frontierBlockedPopulation","frontierBlockedAdults","frontierBlockedReserve","frontierBlockedAge","frontierBlockedProject","frontierBlockedNoCandidate","frontierStarts21","frontierClaims21","frontierRecaptures21","frontierCancels21","frontierRuins21","frontierReinforcedSettlers21","avgPopulationPerTerritory","discoveredNations22","marketContactNations22","reachableTradeNations22","births22","childDeaths22","starvationDeaths22","illnessDeaths22","oldAgeDeaths22","fiscalRevenue23","publicSpending23","recentChildMortality23","recentIllnessDeaths23","recentStarvationDeaths23","availableLaborDays25","constructionLaborDays25","maintenanceLaborDays25","maintenanceRemoteLaborDays25","maintenanceTravelDays25","maintenanceNeedLaborDays25","maintenanceShortfallShare25","avgHunger","claimableNaturalTiles","claimedNaturalTiles","claimedNaturalShare","perfSimMs26","perfRenderMs26","perfMsPerDay26","perfSpeed26","preemptiveFoodMoves27","criticalFoodMoves27","foodReliefMoved27","criticalFoodMoved27","perfWallMs27","perfChunkDays27","perfYieldCount27","largestSettlementPop28","top1SettlementShare28","top3SettlementShare28","settlementPopGini28","settlementEntropy28","settlementConcentration28","commuters28","commuterShare28","urbanPopulation28","urbanPopulationShare28","towns28","cities28","lifeZones28","largestLifeZonePop28","largestLifeZoneSettlements28","housingStrainedResidents28","housingStrainShare28","foodStressedResidents28","foodStressShare28","severeHungerResidents28","urbanMigrationMoves28","urbanHousingActions28","urbanFoodMoves28","urbanFoodMoved28","urbanFoodBlocked28","personGold29","settlementMarketGold29","domesticTrades29","domesticTradeVolume29","domesticTradeGold29","wages29","consumption29","taxes29","publicSpending29","unemployed29","jobCapacity29","jobUsed29","treasuryGold30","marketGold30","personGold30","moneySupply30","adminCenters30","adminLevy30","regionalGrants30","observedGoldSource30","observedGoldSink30","maintenanceWoodNeed30A","maintenanceWoodUsed30A","maintenanceWoodShortfall30A","maintenanceStoneNeed30A","maintenanceStoneUsed30A","maintenanceStoneShortfall30A","activeTreasuryGold30B2","activeMarketGold30B2","activePersonGold30B2","activeMoneySupply30B2","ruinGold30B2","existingMoneySupply30B2","survivalNations30B2","survivalMode30B2","survivalRisk30B2","treasuryReserve30B2","marketCofinance30B2","survivalRelocations30B2","emergencyConvoys30B2","emergencyConvoyFood30B2","severeHunger85B3","severeHunger95B3","starvationGraceEntriesB3","starvationDeathsAfterGraceB3","vacantGraceTilesB3","vacantGraceAbandonsB3","marketInvestmentsB3","marketGoldInvestedB3","stoneResearchPrioritiesB3","severeHungerShare85B4","severeHungerShare95B4","survivalRisk30B4","survivalMode30B4","survivalNations30B4","b4MarketPathMs","b4MarketPathCalls","b4SpecializationDiagMs","b4SpecializationDiagCalls","ironOre31","iron31","tools31","ironOreCap31","ironMines31","smelters31","smithies31","avgIronOrePrice31","avgIronPrice31","avgToolsPrice31","oreMined31","ironSmelted31","toolsMade31","industrialMoves31","industrialMoved31","industrialTrades31","industrialTradeVolume31","ironMineWorkerSlots31A","ironMineWorkers31A","smelterWorkerSlots31A","smelterWorkers31A","smithyWorkerSlots31A","smithyWorkers31A","ironStage31G","ironBlocker31G","industryProjects31G","industryProjectCap31G","pendingIronMines31G","pendingSmelters31G","pendingSmithies31G","eligibleIronDeposits31G","bestIronDeposit31G","ironBlocker31H","industryRealProjects31H","industryProjectMarkers31H","industryReservedSlot31H","industryFundingNeed31H","industryFundingLocal31H","industryFundingRemote31H","industryFundingTreasury31H","industryFundingTotal31H","industryRemoteMarketInvested31H","industryRemoteMarketTransfers31H","industryReservedBlocks31H","industryImmediateStarts31H","ironOreInitial31I","ironOreRemaining31I","ironOreDepletionShare31I","ironDeposits31I","ironDepositsDepleted31I","ironOrePreventedWaste31I","ironOreStorageFullStops31I","ironOrePartialClamps31I","militaryEligiblePopulation32A","activeMilitary32A","reserveMilitary32A","woundedMilitary32A","capturedMilitary32A","militaryCohorts32A","garrisons32A","militaryCohortMembers32A","militaryFrameworkReady32A","mobilizationLevel32A","militaryEligiblePopulation32B","activeMilitary32B","reserveMilitary32B","militaryTargetActive32B","militaryTargetReserve32B","militaryLaborRemoved32B","militaryLaborRemovedDays32B","militaryMobilizations32B","militaryDemobilizations32B","militaryReserveRegistrations32B","militaryCohorts32B","garrisons32B","militaryCohortMembers32B","militaryAvgTraining32B","militaryAvgMorale32B","militaryAvgSupply32B","militaryConcern32B","mobilizationLevel32B","militaryDoctrine32B","militaryEquipmentStock32C","militaryEquipmentCoverage32C","militaryEquipmentMade32C","militaryEquipmentIronUsed32C","militaryEquipmentWoodUsed32C","militaryEquipmentToolsUsed32C","barracks32C","trainingGrounds32C","armories32C","militaryFacilities32C","militaryTrainingAvg32C","militaryEquipmentAvg32C","militaryActive32C","militaryReserve32C","militaryFacilityTarget32C1","militaryFacilityBlocker32C1","militaryFacilityFunding32C1","militaryFacilityGoldNeed32C1","militaryFacilityReservedSlot32C1","formations32D","formationManpower32D","formationsMoving32D","formationMoves32D","garrisonManpower32D1","fieldManpower32D1","fieldCohorts32D1","formationTargetsChanged32D1","adminRegions32D","adminOffices32D","adminOfficeTarget32D1","adminOfficeBlocker32D1","adminOfficeStableYears32D1","adminOfficeSpacePreps32D1","foodAccessBlocked32D","emergencyConvoys32D","starvationDeaths32D","v32dLogCompactions","v32dCompressedEvents","adminFormalRegions32D2","adminProvisionalRegions32D2","adminInstitutionalizedRegions32D2","adminEfficiencyAvg32D2","adminLogisticsSavedCost32D2","adminMaintenanceTravelSaved32D2","adminFormalizations32D2","adminInstitutionalizations32D2","adminCenterMoves32D2","adminRetirements32D2","formationRouteRemaining32D2","formationTrailTiles32D2","housingPressureMax32D3","housingReserveActive32D3","housingReserveDays32D3","housingRelocations32D3","housingActions32D3","housingReserveBlocks32D3","expansionBlocker32D3","expansionBlockerDays32D3","eligibleFrontierTiles32D3","eligibleFrontierSources32D3","frontierCandidateTiles32D3","frontierProjects32D3","frontierProjectCap32D3","formationTrailVisible32D3","formationLastActualMoveCal32D3","warehouseIronOreBonus32D3","housingBlocker32D4","structuralWoodDemand32D4","structuralStoneDemand32D4","tradeExecuted32D4","tradeVolume32D4","tradeTopBlocker32D4","tradeNoRoute32D4","tradeNoDemand32D4","tradeNoSurplus32D4","tradePriceBlock32D4","tradeStrategicPriceBlock32D4","tradeBudgetBlock32D4","treasuryTradeSupport32D4","marketNetworkTransfers32D4","housingBlocker32D5","housingPriorityBlocks32D5","housingPriorityActions32D5","foodRelayMoves32D5","foodRelayQty32D5","foodRelayTopBlocker32D5","microTradeSuppressed32D5","marketDividend32D5","tradeBalance1y32D5","selfReliancePressure32D5","tradeFunnelRecentTop32D5","tradeFunnelRecentCount32D5","treasurySupportFood32D5","treasurySupportStructural32D5","housingBlocker32E1","housingResolverRuns32E1","housingResolverActions32E1","housingContextBuilds32E1","housingContextHits32E1","foodDonorIndexBuilds32E1","foodRouteCacheHits32E1","foodRouteChecks32E1","foodCandidateShortlists32E2","foodPairCacheHits32E2","foodExpensiveChecks32E2","foodRememberedHits32E2","foodMildSkipped32E2","housingNormalSkipped32E2","perfHousing32E1","perfFoodRelay32E1","perfFoodIndex32E1","perfFoodPair32E2","knowledgeFastAdds32E3","knowledgeLegacyAdds32E3","knowledgeTerritoryTilesAvoided32E3","foodReserveFastCalls32E3","foodReserveTileScans32E3","criticalFoodReserveFastCalls32E3","populationIndexCalls32E3","tradePlannerRuns32E4","tradeCandidateEvaluations32E4","tradePlannerRouteChecks32E4","tradeNetworkIntents32E4","tradePostStrategicStarts32E4","tradeNetworkCompleted32E4","tradePartnersUnlocked32E4","tradeRouteCostSavedEst32E4","tradeIntentBlockedProject32E4","tradeIntentBlockedFinance32E4","tradeIntentBlockedMaterials32E4","tradeIntentBlockedSpace32E4","tradeIntentBlockedOther32E4","tradeIntentStatus32E4","tradeIntentBlocker32E4","tradeIntentTargetTile32E4","tradeIntentNewPartners32E4","tradeIntentRouteSaving32E4","tradeRouteMarketBlocks32E4","tradeRouteRangeBlocks32E4","tradeRoutePathBlocks32E4","tradeIntentActive32E5","tradeIntentBuilding32E5","tradeIntentRecovered32E5","tradeIntentCompleted32E5","tradeIntentCancelled32E5","tradeIntentAgedPriority32E5","tradeSoftReserveBlocks32E5","tradeSoftReserveEvents32E5","tradeStrategicSlotWins32E5","tradeActualPartnerGain32E5","tradeActualRouteSaving32E5","tradeActualAvgRouteSaving32E5","tradePostFollowups32E5","tradePostTradeVolume1y32E5","tradeIntentAge32E5","tradeIntentProjectCapAge32E5","tradeIntentPriority32E5","tradeIntentTTLPause32E5","tradeIntentProjectId32E5","tradeActualRouteSavingLast32E5","tradeFollowupVolumeLast32E5","transportTrades32E6","transportGoldPaid32E6","transportMerchantIncome32E6","transportMarketFallback32E6","transportLandGold32E6","transportSeaGold32E6","transportAvgRouteCost32E6","transportAuditChecks32E6","transportAuditMismatches32E6","transportAuditMaxAbsDelta32E6","tradeBlockHousingPriority32E6","tradeBlockIronPriority32E6","tradeBlockMilitaryPriority32E6","tradeBlockSurvivalPriority32E6","tradeBlockResourceReserve32E6","tradeBlockPayment32E6","tradeBlockStrategicGate32E6","tradeBlockInvalid32E6","tradeBlockTileBusy32E6","tradeBlockOther32E6","transportGoldPaidNation32E6","transportServiceIncomeNation32E6","transportNetCostNation32E6","transportTradesNation32E6","merchantGuildStarts32E7","grandMarketStarts32E7","merchantGuildCompleted32E7","grandMarketCompleted32E7","guildHandledTrades32E7","guildTransportGoldCaptured32E7","guildHandlingSavings32E7","grandMarketRecycledGold32E7","grandMarketCycles32E7","commercialAuditChecks32E7","commercialAuditMismatches32E7","commercialFlowCacheBuilds32E7","commercialFinanceBlocks32E7","commercialSpaceBlocks32E7","commercialMarketPoolGold32E7","commercialMarketPoolTransfers32E7","merchantGuilds32E7","grandMarkets32E7","maxIntlEndpointVolume1y32E7","maxDomesticEndpointVolume1y32E7","guildServiceIncomeNation32E7","grandMarketRecycledNation32E7","constructionProposalReviews32E8","constructionProposals32E8","constructionProposalReady32E8","constructionProposalStarts32E8","constructionProposalChanges32E8","constructionBlockProject32E8","constructionBlockFinance32E8","constructionBlockMaterial32E8","constructionBlockSpace32E8","constructionBlockTech32E8","constructionBlockSurvival32E8","constructionBlockPriority32E8","constructionBlockOther32E8","guildRegionalHandledTrades32E8","guildRegionalTransportGold32E8","guildRegionalHandlingSavings32E8","grandMarketStarts32E8","grandMarketCompleted32E8","grandMarketRegionalCandidates32E8","commercialMarketPoolGold32E8","commercialMarketPoolTransfers32E8","constructionProposalTop32E8","constructionProposalBlocker32E8","constructionProposalPriority32E8","guildRegionalTradesNation32E8","guildRegionalIncomeNation32E8","guildRegionalSavingsNation32E8","grandMarketStartsNation32E8","grandMarketCompletedNation32E8","constructionBlockNoDeposit32E9","constructionBlockNoSite32E9","constructionBlockSatisfied32E9","guildHandlingSavingsRecovered32E9","guildHandlingSavingsRecoveries32E9","perfSeasonalTotal32E9","perfSeasonalIron32E9","perfSeasonalMilitary32E9","perfSeasonalAdmin32E9","perfSeasonalFormation32E9","perfSeasonalHousing32E9","perfSeasonalTradePlanner32E9","perfSeasonalTradeLifecycle32E9","perfSeasonalCommerceProposal32E9","perfSeasonalUnattributed32E9","tradeEndpointBase32E9","tradeEndpointPromoted32E9","tradeEndpointTotal32E9","marketEndpointBase32E9","marketEndpointPromoted32E9","marketEndpointTotal32E9","reachableTradeNations32E9","militaryGarrisonManpower32E9","militaryFieldManpower32E9","militaryRosterDuplicates32E9","militaryRosterInvariant32E9","constructionReadyProposal32E9","constructionBlockedProposal32E9","constructionBlockedReason32E9","constructionBlockedRaw32E9","hungerMealAttempts32E10","hungerMealSuccesses32E10","hungerMealFailures32E10","hungerFoodConsumed32E10","hungerRecoveryApplied32E10","foodParadoxEvents32E10","foodExportGuardBlocks32E10","maintenanceDonorCacheBuilds32E10","maintenanceDonorCacheHits32E10","maintenanceRouteEvaluations32E10","maintenanceRouteEvaluationsAvoided32E10","perfSeasonalMaintenanceFinalize32E10","perfSeasonalMaintenancePlan32E10","perfSeasonalLegacyOther32E10","hungerMealAttempts32E10","hungerMealSuccesses32E10","hungerMealFailures32E10","hungerFoodConsumed32E10","hungerRecoveryApplied32E10","foodParadoxEvents32E10","foodParadoxActiveTiles32E10","foodParadoxMaxStreakDays32E10","foodExportGuardBlocks32E10","hungerMealReliefApplied32E11","hungerMealReliefTotal32E11","hungerMealReliefAvg32E11","testScenarioActive32E11","testScenarioId32E11","testScenarioTitle32E11","scenarioImports32E11","scenarioExports32E11","hungerMealReliefAppliedNation32E11","hungerMealReliefTotalNation32E11","hungerMealReliefAvgNation32E11","hungerCurveMeals32E12","hungerCurveBeforeAvg32E12","hungerCurveReliefAvg32E12","hungerCurveRequestedAvg32E12","hungerCurveShapeAvg32E12","hungerPopulation32E12","hunger0Count32E12","hunger1to10Count32E12","hunger11to30Count32E12","hunger31to60Count32E12","hunger61to84Count32E12","hunger85to94Count32E12","hunger95to100Count32E12","hunger0Share32E12","hunger1to10Share32E12","hunger11to30Share32E12","hunger31to60Share32E12","hunger61to84Share32E12","hunger85to94Share32E12","hunger95to100Share32E12","hungerMedian32E12","hungerP9032E12","hungerMax32E12","perfPersonActSamples32E12","perfPersonActEst32E12","perfPersonMetabolismEst32E12","perfPersonKnowledgeEst32E12","perfPersonJobReviewEst32E12","perfPersonWorkOtherEst32E12","perfDomesticEconomy32E12","perfMigrationSocial32E12","testScenarioValidationVersion32E12","scenarioValidations32E12","scenarioValidationFailures32E12","scenarioImports32E12","scenarioExports32E12","testScenarioActive32E12","testScenarioId32E12","testScenarioTitle32E12","hungerCurveMealsNation32E12","hungerCurveBeforeAvgNation32E12","hungerCurveReliefAvgNation32E12","hungerCurveRequestedAvgNation32E12","hungerCurveShapeAvgNation32E12","hungerPopulationNation32E12","hunger0CountNation32E12","hunger1to10CountNation32E12","hunger11to30CountNation32E12","hunger31to60CountNation32E12","hunger61to84CountNation32E12","hunger85to94CountNation32E12","hunger95to100CountNation32E12","hunger0ShareNation32E12","hunger1to10ShareNation32E12","hunger11to30ShareNation32E12","hunger31to60ShareNation32E12","hunger61to84ShareNation32E12","hunger85to94ShareNation32E12","hunger95to100ShareNation32E12","hungerMedianNation32E12","hungerP90Nation32E12","hungerMaxNation32E12","perfPersonLeafSamples32E14","perfPersonHomeTileLookupEst32E14","perfPersonHarvestEst32E14","perfPersonDepositEst32E14","perfPersonResidualWorkEst32E14","homeTileCacheHits32E14","homeTileCacheMisses32E14","homeTileCacheHitShare32E14","csvSchemaChecks32E14","csvSchemaFailures32E14","armoryIronConsumptionDeferred32F","armoryIronReserveBlocks32F","armoryStartAttempts32F","armoryStarts32F","militaryReadinessUpdates32F","militarySupplyDisconnectedObs32F","constructionProposalSyncCorrections32F","perfMilitaryReadiness32F","militaryReadyNations32F","goldTop1Share32F","goldTop2Share32F","militaryReadinessAvg32F","militaryFieldReadiness32F","militaryGarrisonReadiness32F","militarySupplyAvg32F","militarySupplyMaxRoute32F","militarySupplyDisconnected32F","militaryEquipmentCoverage32F","armories32F","armoryPipeline32F","armoryIron32F","armoryIronReserveTarget32F","activeWars33","warsDeclared33","warsEnded33","battles33","battleDeaths33","battleWounded33","occupiedTiles33","occupationStarts33","liberations33","retreats33","atWar33","warId33","warOpponent33","warOpponentId33","warDays33","warExhaustion33","warBattles33","warDeaths33","warWounded33","battlesWon33","battlesLost33","occupiedEnemyTiles33","enemyOccupiedOwnTiles33","withdrawingFormations33A","peacetimeForeignFormations33A","warHistoryCount33A","capitalOccupations33A","withdrawingFormations33A","peacetimeForeignFormations33A","recentBattleMarkers33B","recentBattleSites33B","recentTerritoryEffects33B","activeEngagements33C","engagementsStarted33C","engagementsEnded33C","engagementRounds33C","capitalEngagements33C","regroupingFormations33C","engagedFormations33C","regroupingFormations33C","retreatMoves33C1","postBattleRecoveries33C1","militaryMoveSamples33C1","avgMilitaryMoveDays33C1","retreatingFormations33C1","postBattleRecoveryFormations33C1","fieldBattleMoraleModifier33C1","fieldBaseMorale33C1","fieldEffectiveMorale33C1","nextMilitaryMoveDays33C1","techCostTotal33C2","strategicProgramChanges33C2","peaceMoraleTicks33C2","peaceMoraleCompleted33C2","strategicProgram33C2","strategicProgramLabel33C2","strategicProgramAgeDays33C2","strategicProgramRemainingDays33C2","peaceBattleMoraleMagnitude33C2","techCompletionShare33C2","capitalAssaultRejected33C3","capitalAssaultApproved33C3","deepRecoveryStarted33C3","deepRecoveryCompleted33C3","roadProposals33C3","roadStarts33C3","targetSelections33C3","roadCandidateRejects33C3F","roadFallbackStarts33C3F","deepRecoveringFormations33C3","maxDefeatStreak33C3","roadTiles33C3","roadShare33C3","nationNameMode33C3","multiWarNations33D","coalitionWars33D","maxConcurrentWarsNation33D","interventions33D","independentConcurrentDeclarations33D","activeEngagements33D","engagementRounds33D","fieldFormations33D","assignedFormations33D","constructionProgressTiles33D","activeWarCount33D","fieldFormationCount33D","assignedFormationCount33D","defenseMissions33D","offenseMissions33D","activeWarIntents33D1","preparingWarIntents33D1","readyWarIntents33D1","intelAssessments33D1","formationDormancies33D1","formationReactivations33D1","dormantFormations33D1","warIntentPhase33D1","warIntentTarget33D1","warIntentTargetId33D1","warIntentScore33D1","warIntentConfidence33D1","warIntentAdvantage33D1","dormantFormationCount33D1","techCostTotal33D1A","coalitionHistoryWars33D1A","operationalRouteAudits33D1A","operationalAccess33D1A","dormantPhysicalGhosts33D1A","constructionLaborSeparated33D1B","maintenanceLaborRate33D1B","roadFactor33D1B","housingHouseCap33D1B","housingRowCap33D1B","housingCollectiveCap33D1B","activeBuildProjects33D1B","coalitionHistoryUIOwner33D1B","warHistoryUIOwner33D1C","currentOccupiedTiles33D1C","cumulativeOccupationStarts33D1C","recoveryEscapeNations33D1C","recoveryExpansionStarts33D1C","recoveryEscapeStatus33D1C","recoveryEscapeAgeDays33D1C","recoveryEscapeStarts33D1C","recoveryLowWoodGatherSeasons33D1C","localWoodExhausted33D1C","activeWarPreparations33D2","readyWarPreparations33D2","warPreparationStarts33D2","warPreparationMobilized33D2","warPreparationRoads33D2","warPreparationFacilities33D2","warPreparationDeclarationBlocks33D2","warPreparationDeclarations33D2","warPreparationStatus33D2","warPreparationTarget33D2","warPreparationPct33D2","warPreparationBlocker33D2","warPreparationField33D2","warPreparationFieldGoal33D2","warPreparationFoodGoal33D2","warPreparationReadinessGoal33D2","warPreparationRally33D2","warChestGold33D2A","warChestFundEvents33D2A","warChestAllocated33D2A","warChestReleased33D2A","preparationLockedFormations33D2A","activeFinalCommitments33D2A","warPreparationDeclarations33D2A","finalCommitmentBlocks33D2A","warChestGold33D2A","warChestGoal33D2A","treasurySpendable33D2A","warChestAllocated33D2A","preparationLockedFormations33D2A","readyStableDays33D2A","finalCommitmentDays33D2A","intelPairs33E","intelFreshPairs33E","intelStalePairs33E","intelUnknownPairs33E","intelMeanMilitaryConfidence33E","intelObservations33E","intelLoggedObservations33E","preparationLockRepairs33E","warHistoryUIOwner33E","intelKnownTargets33E","intelFreshTargets33E","intelStaleTargets33E","intelUnknownTargets33E","intelMeanMilitaryConfidence33E","warIntentIntelAgeDays33E","warIntentIntelSource33E","warIntentIntelConfidence33E","warIntentEstimatedEnemyField33E","warIntentActualEnemyField33E","warIntentEnemyFieldError33E","techCount33E1","techCostTotal33E1","knowledgeProductionMultiplier33E1","activeFormations33E1","commandedFormations33E1","avgCommanderScore33E1","commanderAppointments33E1","commanderLosses33E1","smallUnitRounds33E1","smallUnitGuardedRounds33E1","smallUnitCasualties33E1","warHistoryUIOwner33E1","warHistoryLegacyWriterCalls33E1","commandedFormations33E1","avgCommanderScore33E1","intelMeanFieldRangeWidth33E2","reconAttempts33E2","reconSuccesses33E2","reconFailures33E2","declarationIntelSnapshots33E2","declarationRangeMisses33E2","declarationMeanAbsFieldError33E2","materialFieldMisreads33E2","observerEffectQueriesBlocked33E2","warIntentFieldCenter33E2","warIntentFieldMin33E2","warIntentFieldMax33E2","warIntentFieldPlanning33E2","warIntentActualField33E2","warIntentFieldError33E2","warIntentFieldRangeContainsActual33E2","warIntentRiskWeight33E2","warIntentIntelAgeDays33E2","warIntentIntelSource33E2","warIntentIntelConfidence33E2","activeConcentrationGroups33E3","concentrationStarts33E3","rendezvousReached33E3","jointAdvances33E3","jointEngagements33E3","concentrationCancels33E3","piecemealPrevented33E3","concentrationEmergencyBypasses33E3","militaryUIRenderer33E3","activeConcentrationGroups33E3","concentratingFormations33E3","cultureCount33E4","derivedCultureCount33E4","mixedCulturePersons33E4","mixedCultureShare33E4","meanCultureAlignment33E4","cultureOutputPenaltyAvg33E4","cultureMapLayer33E4","cultureNameRegistryFamilies33E4","cultureNameRegistryGiven33E4","capitalPrimaryCulture33E4","capitalPrimaryCultureShare33E4","nationPrimaryCulture33E4","nationPrimaryCultureShare33E4","mixedCulturePersons33E4","mixedCultureShare33E4","meanCapitalCultureAlignment33E4","cultureOutputPenaltyAvg33E4","warScanTopTarget33E4","warScanTopScore33E4","warScanReason33E4","warPipelineIntentCreated33E4A","warPipelineIntentCancelled33E4A","warPipelinePreparationStarted33E4A","warPipelinePreparationCancelled33E4A","warPipelineFinalStarted33E4A","warPipelineFinalCancelled33E4A","warPipelineDeclarationBlocks33E4A","warPipelineDeclarations33E4A","warPipelineObserver33E4A","warPipelineStage33E4A","warPipelineTarget33E4A","warPipelineIntentId33E4A","warPipelineIntentAgeDays33E4A","warPipelinePreparednessPct33E4A","warPipelineBlocker33E4A","warPipelineWarChest33E4A","warPipelineWarChestGoal33E4A","warPipelineReadyStableDays33E4A","warPipelineCommitmentRemainingDays33E4A","warPipelineIntentCreated33E4A","warPipelineIntentCancelled33E4A","warPipelinePreparationStarted33E4A","warPipelinePreparationCancelled33E4A","warPipelineFinalStarted33E4A","warPipelineFinalCancelled33E4A","warPipelineDeclarationBlocks33E4A","warPipelineDeclarations33E4A","warPipelineLastFailureStage33E4A","warPipelineLastFailureReason33E4A","warPipelineLastFailureClass33E4A","warPipelineIntentCancelReasons33E4A","warPipelineFinalCancelReasons33E4A","meanSecondaryCultureShare33E4A","maxForeignCultureShare33E4A","capitalVsNationCultureDistance33E4A","activeOccupationOperations33E5","occupationOperationsStarted33E5","occupationOperationsCompleted33E5","occupationOperationsCancelled33E5","occupationOperationDaysAvg33E5","occupationOperationDaysMax33E5","occupationAttritionWounded33E5","occupationAttritionDeaths33E5","occupationResistanceEncountered33E5","defensiveFirepowerEncountered33E5","neutralMilitaryMoves33E5","neutralMilitaryMoveDays33E5","concentrationCompleted33E5","piecemealFirstRounds33E5","emergencyDefenseUnreachable33E5","occupationOperationsOffensive33E5","occupationOperationsDefensive33E5","occupationProgressMax33E5","occupiedControlledTiles33E5F1","occupiedCoreGarrisons33E5F1","occupiedTileBuildProjects33E5F1","coreOccupied33E5F1","coreGarrisonSuppressed33E5F1","coreGarrisonSuppressions33E5F1","constructionControlBlocks33E5F1","activeFieldFormations33E5F2","commanderFormations33E5F2","commanderCoveragePct33E5F2","occupationFireCompletions33E5F2","occupationFireNoCasualtyCompletions33E5F2","occupationFireCasualtyCompletions33E5F2","occupationFireCasualties33E5F2","armoryNations33E5F2","equipmentNationsWithStock33E5F2","equipmentNationsFullCoverage33E5F2","equipmentCoverageMax33E5F2","equipmentCoverageMedian33E5F2","equipmentStockConcentrationTop133E5F2","roadRejectsInferred33E5F2","commanderFormations33E5F2","activeFieldFormations33E5F2","commanderCoveragePct33E5F2","armoriesObserved33E5F2","equipmentCoverageObserved33E5F2","equipmentStockObserved33E5F2","activeWarGoals33F","peaceSettlements33F","whitePeace33F","goldOnlyPeace33F","territoryOnlyPeace33F","territoryGoldPeace33F","permanentTilesCeded33F","conqueredPersonsTransferred33F","peaceGoldRequested33F","peaceGoldPaid33F","peaceGoldAuditMismatches33F","demobilizationGuards33F","demobilizationGuardedPersons33F","activeConquestAdminTiles33F","activeWarGoals33F","warGoalTargetTiles33F","peaceSettlementsWon33F","peaceSettlementsLost33F","permanentTilesGained33F","permanentTilesLost33F","conqueredPersonsIntegrated33F","peaceGoldReceived33F","peaceGoldPaid33F","endedWarsObserved33F1","naturalPeaceSettlements33F1","migrationSettlementRepairs33F1","endedWarsMissingSettlement33F1","warGoalOperationalTargets33F1","targetReservations33F1","targetDeconflicts33F1","deliberateConcentrations33F1","duplicateOffensiveTargets33F1","finalCommitmentLatches33F1","finalCommitmentSoftCancelPrevented33F1","finalCommitmentHardAborts33F1","intentRetryCooldownSkips33F1","activeTargetReservations33F1","warGoalOperationalTargets33F1","targetDeconflicts33F1","deliberateConcentrations33F1","finalCommitmentLatched33F1","intentRetryCooldownRemaining33F1","preparationFloorApplications33F2","preparationDemobilizationBlockedPersons33F2","intentRetryCooldownApplied33F2","finalCommitmentReviewSkips33F2","finalCommitmentSoftDriftObserved33F2","finalCommitmentSoftCancelEvents33F2","finalCommitmentHardAborts33F2","nationSettlementStatRepairs33F2","nationSettlementStatCurrentMismatch33F2","preparingAgeDaysMax33F2","preparingStuckOver3Years33F2","activeIntentRetryCooldowns33F2","preparationActiveFloor33F2","preparationActiveCount33F2","preparingAgeDays33F2","intentRetryCooldownRemaining33F2","peaceSettlementStatConsistent33F2","demobilizationGraceStarts33F3","demobilizationGraceFloorApplications33F3","cancelledPrepDemobilizationRetainedPersons33F3","demobilizationGraceCompletions33F3","recoveryLockRepairSuppressions33F3","recoveryLockRepairViolations33F3","survivalRetryGatesCreated33F3","survivalRetryGateBlocks33F3","survivalRetryGateReleases33F3","finalCommitmentDemotionBlocks33F3","finalCommitmentSoftCancelEvents33F3","formationDormancyDuringGrace33F3","activeDemobilizationGraces33F3","activeSurvivalRetryGates33F3","demobilizationGraceRemainingDays33F3","demobilizationGraceFloor33F3","survivalRetryGateActive33F3","survivalRetryGateReasons33F3","recoveryRallySuspended33F3","buildGoldPayments33F4","buildGoldCost33F4","buildGoldRecirculated33F4","buildGoldSink33F4","buildGoldAuditChecks33F4","buildGoldAuditMismatches33F4","peaceCessionConnectivityRejects33F4","postPeaceDisconnectedCededTiles33F4","treasuryShare33F4","marketShare33F4","personShare33F4","marketLevyRate33F4","publicSpendingReturnRate33F4","buildGoldCostNation33F4","buildGoldRecirculatedNation33F4","buildGoldSinkNation33F4","moneyTreasuryShareNation33F4","moneyMarketShareNation33F4","moneyPersonShareNation33F4","liquidMoney33F5","liquidMoneyPerCapita33F5","smoothedLiquidMoneyPerCapita33F5","monetaryPriceIndex33F5","monetaryPriceTarget33F5","monetaryAnchorLpc33F5","monetaryAnchorFrozen33F5","monetaryAnchorAgeDays33F5","inflation1y33F5","liquidityPerCapitaGrowth1y33F5","treasuryLiquidityWeight33F5","monetaryElasticity33F5","scarcityPriceFood33F5","nominalPriceFood33F5","realizedPriceFood33F5","realizedVolumeFood33F5","scarcityPriceWood33F5","nominalPriceWood33F5","realizedPriceWood33F5","realizedVolumeWood33F5","scarcityPriceStone33F5","nominalPriceStone33F5","realizedPriceStone33F5","realizedVolumeStone33F5","scarcityPriceIronOre33F5","nominalPriceIronOre33F5","realizedPriceIronOre33F5","realizedVolumeIronOre33F5","scarcityPriceIron33F5","nominalPriceIron33F5","realizedPriceIron33F5","realizedVolumeIron33F5","scarcityPriceTools33F5","nominalPriceTools33F5","realizedPriceTools33F5","realizedVolumeTools33F5","scarcityPriceFoodNation33F5","nominalPriceFoodNation33F5","scarcityPriceWoodNation33F5","nominalPriceWoodNation33F5","scarcityPriceStoneNation33F5","nominalPriceStoneNation33F5","scarcityPriceIronOreNation33F5","nominalPriceIronOreNation33F5","scarcityPriceIronNation33F5","nominalPriceIronNation33F5","scarcityPriceToolsNation33F5","nominalPriceToolsNation33F5","realizedPriceFoodNation33F5P1","realizedVolumeFoodNation33F5P1","realizedPriceWoodNation33F5P1","realizedVolumeWoodNation33F5P1","realizedPriceStoneNation33F5P1","realizedVolumeStoneNation33F5P1","realizedPriceIronOreNation33F5P1","realizedVolumeIronOreNation33F5P1","realizedPriceIronNation33F5P1","realizedVolumeIronNation33F5P1","realizedPriceToolsNation33F5P1","realizedVolumeToolsNation33F5P1","anchorCalibrationRepairs33F5P2","strongIntentReconAttempts33F5P2","weakIntentTimeouts33F5P2","strongIntentTimeouts33F5P2","scoreToPreparing33F5P2","activeWeakIntents33F5P2","activeStrongIntents33F5P2","anchorSearchStarted33F5P2","anchorSearchStartCal33F5P2","warIntentBand33F5P2","warIntentAssessmentAgeDays33F5P2","warIntentAssessmentCount33F5P2","warIntentBaseScore33F5P2","warIntentConcernComponent33F5P2","warIntentRelationComponent33F5P2","warIntentBorderComponent33F5P2","warIntentPowerComponent33F5P2","warIntentDispositionModifier33F5P2","warIntentTradePenalty33F5P2","warIntentRoutePenalty33F5P2","warIntentIntelPenalty33F5P2","frontierGoldPayments33F5A","frontierGoldCost33F5A","frontierGoldWages33F5A","frontierGoldMarket33F5A","frontierGoldSink33F5A","frontierFinanceBlocks33F5A","frontierAuditChecks33F5A","frontierAuditMismatches33F5A","recoveryFrontierPayments33F5A","frontierGoldCostNation33F5A","frontierGoldWagesNation33F5A","frontierGoldMarketNation33F5A","frontierGoldSinkNation33F5A","frontierFinanceBlocksNation33F5A","frontierStartsFinanceNation33F5A","recoveryFrontierPaymentsNation33F5A","frontierReserveFloor33F5A","frontierTreasuryHeadroom33F5A","statsRenderDeferrals33F5A1","frontierFinanceFeasible33F5A1","frontierFinanceBlocker33F5A1","lifecycleDemobilizationLocks33F5A2","withdrawalOwnershipTransfers33F5A2","operationalTargetSelections33F5A2","frontierTerrainPayments33F5A2","frontierTerrainGold33F5A2","frontierAffordableTerrain33F5A2","frontierAffordableGoldCost33F5A2","frontierAffordablePioneers33F5A2","wartimeMobilizationPulses33F5A3","emergencyMobilized33F5A3","wartimeReplacements33F5A3","wartimeReinforcements33F5A3","wartimeReplacementBlocks33F5A3","postwarDemobilized33F5A3","wartimeTargetsCreated33F5A3","peacetimeActiveTarget33F5A3","wartimeActiveTarget33F5A3","wartimeFieldTarget33F5A3","militaryPopulationShare33F5A3","eligibleMobilizationShare33F5A3","wartimeReplacementBlocker33F5A3","emergencyMobilizedNation33F5A3","wartimeReplacementsNation33F5A3","postwarDemobilizedNation33F5A3","ancientFarmUpgradesStarted33F5A4","ancientFarmUpgradesCompleted33F5A4","sawmillStarts33F5A4","sawmillCompleted33F5A4","allTerrainQuarryStarts33F5A4","wartimeTargetInvariantRepairs33F5A4","ancientFarms33F5A4","sawmills33F5A4","sawmillWorkers33F5A4","baseQuarries33F5A4","productionProposalReviews33F5A5","productionProposalAttempts33F5A5","productionProposalStarts33F5A5","productionProposalChanges33F5A5","productionBlockProjectCap33F5A5","productionBlockPriority33F5A5","productionBlockSurvival33F5A5","productionBlockNoSite33F5A5","productionBlockSpace33F5A5","productionBlockWood33F5A5","productionBlockStone33F5A5","productionBlockGold33F5A5","productionBlockRejected33F5A5","codexStructureRebuilds33F5A5","warHistoryStructureRebuilds33F5A5","nationCardStructureRebuilds33F5A5","productionProposalType33F5A5","productionProposalScore33F5A5","productionProposalBlocker33F5A5","productionFacilityStartsNation33F5A5","ancientFarmStartsNation33F5A5","sawmillStartsNation33F5A5","quarryStartsNation33F5A5","aiProfileSchema33F5A6","aiProfileCount33F5A6","legacyDirectTypeAuditA533F5A6","profileProductionStarts33F5A6","kairenPresent33F5A6","aiProfileId33F5A6","aiProfileLabel33F5A6","aiTraitTechnology33F5A6","aiTraitProduction33F5A6","aiTraitExpansion33F5A6","aiTraitTrade33F5A6","aiTraitMilitary33F5A6","aiTraitRisk33F5A6","aiProfileMigrationVersion33F5A7","profileProductionPriorityStarts33F5A7","profileResearchInfraStarts33F5A7","profileResearchInfraBlocks33F5A7","profileReserveAdjustments33F5A7","profileFrontierStarts33F5A7","profileWarAssessments33F5A7","profileStrategicProgramApplications33F5A7","aiEffectiveFrontierChance33F5A7","aiEffectiveFrontierDensityFactor33F5A7","aiEffectiveWarDisposition33F5A7","aiFiscalReserveMultiplier33F5A7","aiMigrationGuardDays33F5A7","recoveryEssentialReviews33F5A8","recoveryEssentialStarts33F5A8","recoveryEssentialSawmillStarts33F5A8","recoveryEssentialFarmStarts33F5A8","recoveryEssentialRejected33F5A8","recoveryEssentialProjectCapBlocks33F5A8","recoveryEssentialTrueSurvivalBlocks33F5A8","recoveryEssentialWarBlocks33F5A8","recoveryEssentialNoNeed33F5A8","recoveryEssentialReserveOverrides33F5A8","recoveryEssentialActive33F5A8","recoveryEssentialLastType33F5A8","recoveryEssentialLastBlocker33F5A8","recoveryEssentialStartsNation33F5A8","recoveryEssentialSawmillStartsNation33F5A8","recoveryEssentialFarmStartsNation33F5A8","aiProfileHardcodedDecisionComparisons33G","aiProfileCapabilitySchema33G","aiProfileCompatibilityReads33G","aiProfileCapabilitySurvival33G","aiProfileCapabilityTrade33G","aiProfileCapabilityExpansion33G","aiProfileCapabilityUrban33G","aiProfileCapabilityResource33G","formationControlSchema33G1","formationControlOwnerChanges33G1","formationControlConflicts33G1","recoveryRallySuspensions33G1","recoveryRallyResumes33G1","recoveryFormationRehomes33G1","aiProfileJsonSchema33G1","aiProfileCustomCount33G1","aiProfileImports33G1","aiProfileAssignments33G1","aiProfileValidationRejects33G1","formationControlOwners33G1","formationControlConflictsNation33G1","recoveryFormationRehomesNation33G1","aiProfileCustom33G1","formationWriteGateSchema33G1A","formationTargetWriteBlocks33G1A","recoveryTargetWriteBlocks33G1A","preparationTargetWriteBlocks33G1A","formationTargetGateInstalls33G1A","recoveryPlateauEvaluations33G1A","recoveryPlateauExits33G1A","recoveryPlateauResets33G1A","formationTargetWriteBlocksNation33G1A","recoveryTargetWriteBlocksNation33G1A","preparationTargetWriteBlocksNation33G1A","recoveryPlateauStableDays33G1A","recoveryAgeDays33G1A","recoveryPlateauEligible33G1A","recoveryPlateauBlockers33G1A","recoveryPlateauExitsNation33G1A","cultureCount33G2","kairenCultureReady33G2","postwarPreparationHandoffs33G2","postwarHomeCleanupMarkers33G2","aiEditorSchema33G2","foundingCulture33G2","aiProfileSource33G2","aiProfileFingerprint33G2","aiNationIdentitySchema33G2A","customCultureCount33G2A","profileIdentityImports33G2A","profileIdentityAssignments33G2A","freshFounderCultureApplications33G2A","csvExports33G2A","nationColor33G2A","profileIdentityCultureMode33G2A","profileIdentityCultureId33G2A","techCount33G2B","techCostTotal33G2B","recoveryPlannerSkips33G2B","genderNameSchema33G2B","founderNameFieldRepairs33G2B","nationFillColor33G2B","nationBorderColor33G2B","recoveryWoodOperational33G2B","recoveryWoodFloor33G2B","recoveryWoodFlowFloor33G2B","recoveryWoodProduction30G2B","recoveryMaintenanceWoodShortfallShare33G2B","g3ValidationSchema33G3","g3ExperimentActive33G3","g3ExperimentSeed33G3","g3ExperimentProfile33G3","g3ExperimentTargetNation33G3","g3CheckpointCount33G3","g3Final70Captured33G3","g3TestNation33G3","g3FrontierStarts33G3","g3FrontierClaims33G3","g3WarIntents33G3","g3WarDeclarations33G3","g3RecoveryEntries33G3","g3RecoveryDays33G3","g3SurvivalEntries33G3","g3SurvivalDays33G3","g3InternationalTrades33G3","g3InternationalTradeVolume33G3","g3KnowledgePerCapita33G3","g3TradeVolumePerCapita33G3","g3ProductionStarts33G3","g3CommerceStarts33G3","g3ResearchStarts33G3","g3MilitaryStarts33G3","warDispositionRawG3A","warDispositionEffectiveG3A","warCommitmentG3A","prepareBandAssessmentsG3A","prepareBandIntentsG3A","preparingIntentsG3A","readyIntentsG3A","declaredIntentsG3A","lastIntentBandG3A","lastIntentScoreG3A","lastDeclarationBlockerG3A","prepPctG3A","prepBlockerG3A","prepFoodGoalG3A","prepReadinessGoalG3A","prepAdvantageGoalG3A","prepGoldGoalG3A","prepBaseFoodGoalG3A","prepBaseReadinessGoalG3A","prepBaseAdvantageGoalG3A","prepBaseGoldGoalG3A","formationPowerCount33H","formationPowerAverage33H","formationPowerMax33H","degradedFormations33H","severeFormations33H","battlePowerDeltaEvents33H","normalFormations33H1","warningFormations33H1","criticalFormations33H1","displayPowerDeltaEvents33H1","peacetimeReferenceSyncs33H2","formationCombatPower33H","formationCombatPowerAvg33H","degradedFormations33H","severeFormations33H","normalFormations33H1","warningFormations33H1","criticalFormations33H1","equipmentProduced33I1","equipmentIssued33I1","equipmentReturned33I1","equipmentReequipped33I1","legacyKitsMigrated33I1","equipmentConservationErrors33I1","clubFallback33I1","equipmentInventoryItems33I1","equipmentWorkOrders33I1","equipmentLogisticsMoves33I1","equipmentLogisticsMoves33I1A","equipmentLogisticsItems33I1A","equipmentDemandWeapon33I1A","equipmentDemandArmor33I1A","equipmentStrandedWeapons33I1A","temporaryMilitaryCrafters33I1A","temporaryMilitaryCraftAssignments33I1A","temporaryMilitaryCraftWorkCycles33I1A","equipmentBattleCasualtyItems33I1A1","equipmentBattleRecovered33I1A1","equipmentBattleLost33I1A1","equipmentRecoveryCache33I1A1","equipmentRecoveryDeposited33I1A1","equipmentAbandonedWithFormation33I1A1","legacyUntrackedLoss33I1A1","equipmentConservationErrors33I1A1","formalWeaponCoverage33I1","armorCoverage33I1","compatEquipmentCoverage33I1","clubFallback33I1","equipmentInventoryItems33I1","equipmentInventoryCapacity33I1","equipmentWorkOrders33I1","equipmentProduced33I1","equipmentIssued33I1","equipmentReturned33I1","equipmentReequipped33I1","legacyKitsMigrated33I1","migrationRoundingDelta33I1","equipmentLogisticsMoves33I1","equipmentConservationErrors33I1","equipmentInventory33I1","equipmentLogisticsMoves33I1A","equipmentLogisticsItems33I1A","equipmentDemandWeapon33I1A","equipmentDemandArmor33I1A","equipmentStrandedWeapons33I1A","temporaryMilitaryCrafters33I1A","temporaryMilitaryCraftAssignments33I1A","temporaryMilitaryCraftWorkCycles33I1A","equipmentLogisticsBlocked33I1A","equipmentBattleCasualtyItems33I1A1","equipmentBattleRecovered33I1A1","equipmentBattleLost33I1A1","equipmentRecoveryCache33I1A1","equipmentRecoveryDeposited33I1A1","equipmentAbandonedWithFormation33I1A1","legacyUntrackedLoss33I1A1","equipmentConservationErrors33I1A1","equipmentNonCombatDeathRecovered33I1A2","equipmentExternalMigrationRecovered33I1A2","equipmentPeaceCessionRecovered33I1A2","equipmentPreI1A2UntrackedLoss33I1A2","equipmentLifecycleReturnEvents33I1A2","equipmentNonCombatDeathRecovered33I1A2","equipmentExternalMigrationRecovered33I1A2","equipmentPeaceCessionRecovered33I1A2","equipmentPreI1A2UntrackedLoss33I1A2","equipmentLifecycleReturnEvents33I1A2","equipmentRuinItems33I3CH2","equipmentRuinLedgerHeld33I3CH2","equipmentRuinRecovered33I3CH2","equipmentRuinLedgerMismatch33I3CH2","equipmentRuinHeld33I3CH2","equipmentRuinTransferredOut33I3CH2","equipmentRuinAcquired33I3CH2","activeSettlements34B","abandonedSettlements34B","settlementRegistryErrors34B","postwarWithdrawing34BHF1","postwarBlocked34BHF1","activeSettlements34C","multiTileSettlements34C","mergedSettlements34C","settlementErrors34C","settlementReviews34C","settlementMerges34C","settlementSplits34C","settlementReviewMs34C","settlementCacheBuilds34C","settlementCacheHits34C","foodIndexBuilds34C1","foodIndexHits34C1","foodTerritoryVisitsAvoided34C1","foodActualPopulatedVisits34C1","workCandidateBuilds34C1","workCandidateHits34C1","maintenanceAdminModelBuilds34C1A","maintenanceAdminModelHits34C1A","profileEnabled34C1B","profileQuarter34C1B","profileOuterMs34C1B","profileSamples34C1B","profileMissing34C1B","profileBookkeepingMs34C1B","profileTimerSamples34C1B","profileLegacyOtherE10Ms34C1B","profile_core07Ms34C1B","profile_maintenance08Ms34C1B","profile_society18Ms34C1B","profile_frontier20Ms34C1B","profile_frontier24Ms34C1B","profile_survival30Ms34C1B","profile_industry31Ms34C1B","profile_military32Ms34C1B","profile_administration32Ms34C1B","profile_housing32Ms34C1B","profile_tradeIntent32Ms34C1B","profile_tradeLifecycle32Ms34C1B","profile_commerce32Ms34C1B","profile_hunger32Ms34C1B","profile_armory32Ms34C1B","profile_war33Ms34C1B","profile_warRecovery33Ms34C1B","profile_production33Ms34C1B","profile_aiInvestment33Ms34C1B","profile_equipment33Ms34C1B","profile_after33Ms34C1B","profileNationOuterMs34C1B","profileNationTopLayer34C1B","profileNationTopLayerMs34C1B","profileNationCheckpointsMissing34C1B","c1cScopes","c1cScannedEntries","c1cIndexBuildMs","c1cSpecializationMs","c1cSpecializationCalls","c1cTradeHits","c1cConstructionHits","c1cStoneHits","c1cFallbacks","c1cInvalidations","c1cLegacyChecksAvoided","coreDEnabled","coreDQuarter","coreDTotalMs","coreDRootMs","coreDResidualMs","coreDC1BReferenceMs","coreDC1BDeltaMs","coreDNations","coreDLogEntriesCopied","coreDTerritoryUpperBound","coreD_decisionMs","coreD_decisionExclusiveMs","coreD_decisionCalls","coreD_baseScoresMs","coreD_baseScoresExclusiveMs","coreD_baseScoresCalls","coreD_decisionLogMs","coreD_decisionLogExclusiveMs","coreD_decisionLogCalls","coreD_infrastructureMs","coreD_infrastructureExclusiveMs","coreD_infrastructureCalls","coreD_developmentMs","coreD_developmentExclusiveMs","coreD_developmentCalls","coreD_houseMs","coreD_houseExclusiveMs","coreD_houseCalls","coreD_defenseMs","coreD_defenseExclusiveMs","coreD_defenseCalls","coreD_expansionMs","coreD_expansionExclusiveMs","coreD_expansionCalls","coreDNationTotalMs","coreDNationRootMs","coreDNationResidualMs","coreDNationLogEntriesCopied","coreDNationTerritory","coreDNationPopulation","coreDNationTerritoryUpperBound","coreDNation_decisionMs","coreDNation_decisionExclusiveMs","coreDNation_decisionCalls","coreDNation_baseScoresMs","coreDNation_baseScoresExclusiveMs","coreDNation_baseScoresCalls","coreDNation_decisionLogMs","coreDNation_decisionLogExclusiveMs","coreDNation_decisionLogCalls","coreDNation_infrastructureMs","coreDNation_infrastructureExclusiveMs","coreDNation_infrastructureCalls","coreDNation_developmentMs","coreDNation_developmentExclusiveMs","coreDNation_developmentCalls","coreDNation_houseMs","coreDNation_houseExclusiveMs","coreDNation_houseCalls","coreDNation_defenseMs","coreDNation_defenseExclusiveMs","coreDNation_defenseCalls","coreDNation_expansionMs","coreDNation_expansionExclusiveMs","coreDNation_expansionCalls","scoringEScopes","scoringETerritorySum","scoringEResidentRows","scoringEAliveChecks","scoringENearbyChecks","scoringECandidates","scoringEBaseScopes","scoringETradeAccessBuilds","scoringETradeAccessHits","tradeFPlans","tradeFPostBuilds","tradeFPostHits","tradeFRoadBuilds","tradeFRoadHits","tradeFProfileEnabled","tradeFLastPlanMs","tradeFLastPartnersMs","tradeFLastOpportunityMs","tradeFLastShortlistMs","tradeFLastCandidatesMs","tradeFLastRouteInfoMs","tradeFLastLandCostMs","tradeFLastTradePathMs","survivalGDiagRuns","survivalGB4Runs","survivalGFlowIndexBuilds","survivalGFlowIndexHits","survivalGFlowEntriesScanned","survivalGFlowEventsAccepted","survivalGFlowFallbacks","survivalGActiveSkips","survivalGDelegatedSkips","survivalGLastDiagMs","survivalGLastIndexMs","survivalGLastB4Ms","maintenanceHFinalizes","maintenanceHOrders","maintenanceHWithdraws","maintenanceHDonorBuilds","maintenanceHDonorEvaluations","maintenanceHAdminScopes","maintenanceHAdminReuses","maintenanceHProfileEnabled","maintenanceHLastFinalizeMs","maintenanceHLastWithdrawalMs","maintenanceHLastDonorMs","maintenanceHTotalFinalizeMs"],"renames":[[547,"global.hungerMealAttempts32E10"],[548,"global.hungerMealSuccesses32E10"],[549,"global.hungerMealFailures32E10"],[550,"global.hungerFoodConsumed32E10"],[551,"global.hungerRecoveryApplied32E10"],[552,"global.foodParadoxEvents32E10"],[553,"global.foodExportGuardBlocks32E10"],[561,"nation.hungerMealAttempts32E10"],[562,"nation.hungerMealSuccesses32E10"],[563,"nation.hungerMealFailures32E10"],[564,"nation.hungerFoodConsumed32E10"],[565,"nation.hungerRecoveryApplied32E10"],[566,"nation.foodParadoxEvents32E10"],[569,"nation.foodExportGuardBlocks32E10"],[698,"global.withdrawingFormations33A"],[699,"global.peacetimeForeignFormations33A"],[702,"nation.withdrawingFormations33A"],[703,"nation.peacetimeForeignFormations33A"],[712,"global.regroupingFormations33C"],[714,"nation.regroupingFormations33C"],[818,"global.warChestGold33D2A"],[820,"global.warChestAllocated33D2A"],[822,"global.preparationLockedFormations33D2A"],[826,"nation.warChestGold33D2A"],[829,"nation.warChestAllocated33D2A"],[830,"nation.preparationLockedFormations33D2A"],[837,"global.intelMeanMilitaryConfidence33E"],[846,"nation.intelMeanMilitaryConfidence33E"],[857,"global.commandedFormations33E1"],[858,"global.avgCommanderScore33E1"],[866,"nation.commandedFormations33E1"],[867,"nation.avgCommanderScore33E1"],[888,"global.activeConcentrationGroups33E3"],[897,"nation.activeConcentrationGroups33E3"],[901,"global.mixedCulturePersons33E4"],[902,"global.mixedCultureShare33E4"],[904,"global.cultureOutputPenaltyAvg33E4"],[912,"nation.mixedCulturePersons33E4"],[913,"nation.mixedCultureShare33E4"],[915,"nation.cultureOutputPenaltyAvg33E4"],[919,"global.warPipelineIntentCreated33E4A"],[920,"global.warPipelineIntentCancelled33E4A"],[921,"global.warPipelinePreparationStarted33E4A"],[922,"global.warPipelinePreparationCancelled33E4A"],[923,"global.warPipelineFinalStarted33E4A"],[924,"global.warPipelineFinalCancelled33E4A"],[925,"global.warPipelineDeclarationBlocks33E4A"],[926,"global.warPipelineDeclarations33E4A"],[938,"nation.warPipelineIntentCreated33E4A"],[939,"nation.warPipelineIntentCancelled33E4A"],[940,"nation.warPipelinePreparationStarted33E4A"],[941,"nation.warPipelinePreparationCancelled33E4A"],[942,"nation.warPipelineFinalStarted33E4A"],[943,"nation.warPipelineFinalCancelled33E4A"],[944,"nation.warPipelineDeclarationBlocks33E4A"],[945,"nation.warPipelineDeclarations33E4A"],[979,"global.activeFieldFormations33E5F2"],[980,"global.commanderFormations33E5F2"],[981,"global.commanderCoveragePct33E5F2"],[993,"nation.commanderFormations33E5F2"],[994,"nation.activeFieldFormations33E5F2"],[995,"nation.commanderCoveragePct33E5F2"],[999,"global.activeWarGoals33F"],[1008,"global.peaceGoldPaid33F"],[1013,"nation.activeWarGoals33F"],[1021,"nation.peaceGoldPaid33F"],[1026,"global.warGoalOperationalTargets33F1"],[1028,"global.targetDeconflicts33F1"],[1029,"global.deliberateConcentrations33F1"],[1036,"nation.warGoalOperationalTargets33F1"],[1037,"nation.targetDeconflicts33F1"],[1038,"nation.deliberateConcentrations33F1"],[1413,"global.degradedFormations33H"],[1414,"global.severeFormations33H"],[1416,"global.normalFormations33H1"],[1417,"global.warningFormations33H1"],[1418,"global.criticalFormations33H1"],[1423,"nation.degradedFormations33H"],[1424,"nation.severeFormations33H"],[1425,"nation.normalFormations33H1"],[1426,"nation.warningFormations33H1"],[1427,"nation.criticalFormations33H1"],[1428,"global.equipmentProduced33I1"],[1429,"global.equipmentIssued33I1"],[1430,"global.equipmentReturned33I1"],[1431,"global.equipmentReequipped33I1"],[1432,"global.legacyKitsMigrated33I1"],[1433,"global.equipmentConservationErrors33I1"],[1434,"global.clubFallback33I1"],[1435,"global.equipmentInventoryItems33I1"],[1436,"global.equipmentWorkOrders33I1"],[1437,"global.equipmentLogisticsMoves33I1"],[1438,"global.equipmentLogisticsMoves33I1A"],[1439,"global.equipmentLogisticsItems33I1A"],[1440,"global.equipmentDemandWeapon33I1A"],[1441,"global.equipmentDemandArmor33I1A"],[1442,"global.equipmentStrandedWeapons33I1A"],[1443,"global.temporaryMilitaryCrafters33I1A"],[1444,"global.temporaryMilitaryCraftAssignments33I1A"],[1445,"global.temporaryMilitaryCraftWorkCycles33I1A"],[1446,"global.equipmentBattleCasualtyItems33I1A1"],[1447,"global.equipmentBattleRecovered33I1A1"],[1448,"global.equipmentBattleLost33I1A1"],[1449,"global.equipmentRecoveryCache33I1A1"],[1450,"global.equipmentRecoveryDeposited33I1A1"],[1451,"global.equipmentAbandonedWithFormation33I1A1"],[1452,"global.legacyUntrackedLoss33I1A1"],[1453,"global.equipmentConservationErrors33I1A1"],[1457,"nation.clubFallback33I1"],[1458,"nation.equipmentInventoryItems33I1"],[1460,"nation.equipmentWorkOrders33I1"],[1461,"nation.equipmentProduced33I1"],[1462,"nation.equipmentIssued33I1"],[1463,"nation.equipmentReturned33I1"],[1464,"nation.equipmentReequipped33I1"],[1465,"nation.legacyKitsMigrated33I1"],[1467,"nation.equipmentLogisticsMoves33I1"],[1468,"nation.equipmentConservationErrors33I1"],[1470,"nation.equipmentLogisticsMoves33I1A"],[1471,"nation.equipmentLogisticsItems33I1A"],[1472,"nation.equipmentDemandWeapon33I1A"],[1473,"nation.equipmentDemandArmor33I1A"],[1474,"nation.equipmentStrandedWeapons33I1A"],[1475,"nation.temporaryMilitaryCrafters33I1A"],[1476,"nation.temporaryMilitaryCraftAssignments33I1A"],[1477,"nation.temporaryMilitaryCraftWorkCycles33I1A"],[1479,"nation.equipmentBattleCasualtyItems33I1A1"],[1480,"nation.equipmentBattleRecovered33I1A1"],[1481,"nation.equipmentBattleLost33I1A1"],[1482,"nation.equipmentRecoveryCache33I1A1"],[1483,"nation.equipmentRecoveryDeposited33I1A1"],[1484,"nation.equipmentAbandonedWithFormation33I1A1"],[1485,"nation.legacyUntrackedLoss33I1A1"],[1486,"nation.equipmentConservationErrors33I1A1"],[1487,"global.equipmentNonCombatDeathRecovered33I1A2"],[1488,"global.equipmentExternalMigrationRecovered33I1A2"],[1489,"global.equipmentPeaceCessionRecovered33I1A2"],[1490,"global.equipmentPreI1A2UntrackedLoss33I1A2"],[1491,"global.equipmentLifecycleReturnEvents33I1A2"],[1492,"nation.equipmentNonCombatDeathRecovered33I1A2"],[1493,"nation.equipmentExternalMigrationRecovered33I1A2"],[1494,"nation.equipmentPeaceCessionRecovered33I1A2"],[1495,"nation.equipmentPreI1A2UntrackedLoss33I1A2"],[1496,"nation.equipmentLifecycleReturnEvents33I1A2"]]};
const v2ColumnNames=SCHEMA_V2.originalColumns.slice();
for(const [index,name] of SCHEMA_V2.renames)v2ColumnNames[index]=name;
const proto=NS.World?.prototype;
if(!proto||!NS.SaveSystem||!NS.Telemetry)throw Error('D0 bootstrap must execute after legacy script #164');
const originalSerialize=proto.serialize, originalFrom=NS.World.from;
proto.serialize=function(){const data=originalSerialize.call(this);data.version=VERSION;return data;};
// This version adapter is load-only. Old versions are not a release compatibility contract.
NS.World.from=function(data){
 if(!data||data.version!==VERSION)throw Error('V0.34D0 저장 파일만 지원합니다. 이전 버전은 해당 버전에서 열어 주세요.');
 return originalFrom({...data,version:PREVIOUS});
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const data=oldJSON.call(this,w);data.version=VERSION;
 if(data.worldSummary)data.worldSummary.v034d0Revision='multi-file-build-and-csv-v2';
 return data;};
function csvHeaderParts(line){
 const out=[];let field='',quote=false;
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'){
   if(quote&&line[i+1]==='"'){field+='"';i++;}
   else quote=!quote;
  }else if(ch===','&&!quote){out.push(field);field='';}
  else field+=ch;
 }
 if(quote)throw Error('CSV 헤더의 따옴표가 닫히지 않았습니다.');
 out.push(field);return out;
}
function csvV2(csv){
 const end=csv.indexOf('\n');if(end<0)throw Error('Snapshot CSV 헤더가 없습니다.');
 const original=csvHeaderParts(csv.slice(0,end).replace(/\r$/,''));
 if(original.length!==SCHEMA_V2.originalColumns.length)throw Error(`D0 CSV 스키마 길이 불일치: ${original.length} / ${SCHEMA_V2.columnCount}`);
 for(let i=0;i<original.length;i++)if(original[i]!==SCHEMA_V2.originalColumns[i])throw Error(`D0 CSV 스키마 변동: ${i}번 열 (${original[i]})`);
 const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
 return v2ColumnNames.map(q).join(',')+csv.slice(end);
}
function download(filename,content,type){const u=URL.createObjectURL(new Blob([content],{type:type||'application/json'}));
 const a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const originalSave=NS.SaveSystem;
NS.SaveSystem={...originalSave,
 save(w){try{localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('D0 세이브 저장 실패: '+e.message);}},
 load(){const s=localStorage.getItem(SAVE_KEY);return s?NS.World.from(JSON.parse(s)):null;},
 export(w){download(`village-observer-v034D0-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D0-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSV(w){const csv=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(csv);
  if(check&&!check.ok)throw Error('D0 legacy CSV 행·열 오류 '+JSON.stringify(check.bad?.slice(0,3)));
  download(`village-observer-v034D0-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');},
 exportDevCSVV2(w){const csv=csvV2(w.telemetry.snapshotsCSV()),check=NS.V032E14?.validateCSV?.(csv);
  if(check&&!check.ok)throw Error('D0 CSV V2 행·열 오류 '+JSON.stringify(check.bad?.slice(0,3)));
  download(`village-observer-v034D0-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');}
};
NS.V034D0={version:VERSION,saveKey:SAVE_KEY,csvV2,schema:{version:2,columnCount:SCHEMA_V2.columnCount,duplicateNames:SCHEMA_V2.duplicateNames,duplicateExtraColumns:SCHEMA_V2.duplicateExtraColumns,originalColumns:SCHEMA_V2.originalColumns,v2Columns:v2ColumnNames},sourceMode:'manifest-original-order'};
function addCSVButton(){
 const legacy=document.getElementById('exportLogCsvBtn');if(!legacy||document.getElementById('exportLogCsvV2Btn'))return;
 legacy.textContent='스냅샷 CSV (Legacy)';
 const b=document.createElement('button');b.id='exportLogCsvV2Btn';b.textContent='스냅샷 CSV V2';b.title='중복 헤더 없는 1,683열 CSV. 데이터와 열 순서는 Legacy와 동일';
 b.addEventListener('click',()=>{
  try{const w=window.villageObserver?.world;if(!w)throw Error('현재 세계가 없습니다.');NS.SaveSystem.exportDevCSVV2(w);}
  catch(e){console.error('D0 CSV V2',e);alert('CSV V2 저장 실패: '+e.message);}
 });
 legacy.insertAdjacentElement('afterend',b);
}
if(NS.UI){const header=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(){const result=header.call(this);document.title='Village Observer '+VERSION;
  const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';
  return result;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({
 version:VERSION,date:'2026-10-11',title:'Multi-file Foundation + Regression Baseline',
 summary:'165개 JS·4개 CSS의 원래 실행 순서를 유지하면서 Hosted/단일 HTML 이중 빌드 구조를 도입하고, 중복 헤더 없는 Snapshot CSV V2를 추가합니다. 시뮬레이션 밸런스는 변경하지 않습니다.',
 sections:[
  ['개발 구조',['원본 실행 순서와 각 script/style 실행 경계를 유지하는 Manifest 관리 개발 소스.','GitHub Pages용 Hosted와 단독 실행 index.html을 동일한 소스로 빌드합니다.','기존 코드·스크립트 순서의 SHA-256 및 빌드 재현성 검사를 제공합니다.']],
  ['관측 데이터',['Legacy CSV는 그대로 제공하며, 1,683열 CSV V2는 중복 헤더 72개를 고유 이름으로 구분합니다.','값·행·열 순서는 그대로 유지하고 열 변경은 schema-v2.json에서 추적합니다.']],
  ['저장 및 범위',['D0 전용 저장 키를 사용하며 이전 버전 세이브는 필수 호환 대상이 아닙니다.','Settlement·전투·인구·경제·AI·난수 규칙에는 변경이 없습니다.']]
 ]
});
addCSVButton();
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D0 initial header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034d1.js */
/* V0.34D1 — read-only Settlement Aggregate V1. No economic or Person state mutation. */
(function(NS){'use strict';
const VERSION='V0.34D1',PREVIOUS='V0.34D0',SAVE_KEY='village-observer-v034d1';
const RESOURCES=['food','wood','stone','iron_ore','iron','tools'];
const N=x=>{const n=Number(x);return Number.isFinite(n)?n:0;};
const same=(a,b)=>String(a)===String(b);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const F=x=>N(x).toFixed(2);
function activeRecords(w){return (w?.v34b?.settlements||[]).filter(r=>r.lifecycle==='ACTIVE'&&Array.isArray(r.tileIds)&&r.tileIds.length);}
function lookup(w,id){return w?._v34bActive?.get(String(id))||activeRecords(w).find(r=>same(r.id,id))||null;}
function nation(w,id){return (w?.villages||[]).find(v=>same(v.id,id))||null;}
function housing(t){if(NS.V034D2A?.capAt)return NS.V034D2A.capAt(t);let out=0;const arr=t.buildings||[];
 for(let i=0;i<arr.length;i++){const b=arr[i],cap=N(NS.BUILDINGS?.[b]?.capacity);if(!cap)continue;
  const eff=typeof t.buildingEfficiency==='function'?N(t.buildingEfficiency(b)):Math.min(1,Math.max(0,N(t.buildingCondition?.[i]??100)/70));out+=cap*eff;}
 return out;
}
// Strictly observational. Do NOT invoke ensureLaborIndex29, stockAt, tileResidents or old cachedAggregate.
function prepare(w){const byNation=new Map();for(const v of w.villages||[]){const peopleByHome=new Map(),peopleByWork=new Map();
 for(const p of v.residents||[]){if(!p||p.alive===false)continue;
  const home=Number(p.homeTileId);if(Number.isInteger(home)){const a=peopleByHome.get(home)||[];a.push(p);peopleByHome.set(home,a);}
  if(p.workTileId!==null&&p.workTileId!==undefined&&p.workTileId!==''){const work=Number(p.workTileId);if(Number.isInteger(work)){const a=peopleByWork.get(work)||[];a.push(p);peopleByWork.set(work,a);}}
 }
 byNation.set(String(v.id),{v,peopleByHome,peopleByWork});}
 return {world:w,byNation};
}
function aggregate(w,id,prepared){const r=lookup(w,id);if(!r)return null;
 const prep=prepared?.world===w?prepared:prepare(w),z=prep.byNation.get(String(r.nationId)),v=z?.v;
 if(!v)return null;
 const members=new Set(r.tileIds.map(Number)),resources=Object.fromEntries(RESOURCES.map(k=>[k,0])),resourcesByTile=[],buildingsByType={},condition={sum:0,count:0,inactive:0,below70:0},finance={marketGold:0,walletGold:0},housingInfo={capacity:0,residents:0,overcrowdedTiles:0,shortage:0},people={total:0,children:0,age15Plus:0,age16Plus:0,age18Plus:0,pioneers:0,activeMilitary:0,assignedJobs:0,withWorkTile:0,workplaces:0,inboundCommuters:0,outboundCommuters:0},tileDetails=[];
 for(const tid of r.tileIds){const t=w.map.get(Number(tid));if(!t)continue;
  const resident=z.peopleByHome.get(Number(tid))||[],cap=housing(t),row={tileId:Number(tid),population:resident.length,housingCapacity:cap,stocks:{},marketGold:N(t.v29Economy?.marketGold),buildings:(t.buildings||[]).length};
  housingInfo.capacity+=cap;housingInfo.residents+=resident.length;housingInfo.shortage+=Math.max(0,resident.length-cap);if(resident.length>cap+1e-9)housingInfo.overcrowdedTiles++;
  finance.marketGold+=row.marketGold;
  for(const k of RESOURCES){const val=N(t.stocks?.[k]);resources[k]+=val;row.stocks[k]=val;}
  for(let i=0;i<(t.buildings||[]).length;i++){const key=t.buildings[i];buildingsByType[key]=(buildingsByType[key]||0)+1;const c=N(t.buildingCondition?.[i]??100);condition.sum+=c;condition.count++;if(c<=0)condition.inactive++;if(c<70)condition.below70++;}
  tileDetails.push(row);resourcesByTile.push({tileId:row.tileId,...row.stocks});
 }
 for(const tid of r.tileIds){for(const p of z.peopleByHome.get(Number(tid))||[]){people.total++;const age=N(p.age);if(age<15)people.children++;if(age>=15)people.age15Plus++;if(age>=16)people.age16Plus++;if(age>=18)people.age18Plus++;
  if(p.assignment==='PIONEER')people.pioneers++;if(p.militaryStatus32A==='active'||p.militaryActive32B)people.activeMilitary++;
  if(p.job&&p.job!=='무직'&&p.job!=='실업')people.assignedJobs++;finance.walletGold+=N(p.gold29);
  const wr=p.workTileId;if(wr!==null&&wr!==undefined&&wr!==''){people.withWorkTile++;const target=w.map.get(Number(wr));if(!members.has(Number(wr))||!target||!same(target.ownerId,r.nationId))people.outboundCommuters++;}
 }}
 // Work location is computed separately; foreign-nation workers do not inflate resident population.
 for(const [nid,other] of prep.byNation)for(const tid of r.tileIds){const workers=other.peopleByWork.get(Number(tid))||[];for(const p of workers){people.workplaces++;if(!same(nid,r.nationId)||!members.has(Number(p.homeTileId)))people.inboundCommuters++;}}
 return {settlementId:r.id,nationId:r.nationId,nationName:v.name,coreTileId:r.coreTileId,tileIds:r.tileIds.slice(),tiles:r.tileIds.length,population:people.total,buildings:condition.count,resources,resourcesByTile,buildingsByType,condition:{count:condition.count,average:condition.count?condition.sum/condition.count:0,inactive:condition.inactive,below70:condition.below70},housing:housingInfo,people,finance,tileDetails};
}
function all(w,prepared){const prep=prepared?.world===w?prepared:(NS.V034D1?.prepare?.(w)??prepare(w));return activeRecords(w).map(r=>aggregate(w,r.id,prep)).filter(Boolean);}
// Independent tile/Person audit: no aggregate cache, and no calls to gameplay / labor reconciliation APIs.
function audit(w,rows){rows=rows||all(w);const errors=[],claimed=new Set(),byId=new Map(rows.map(r=>[r.settlementId,r]));
 const tallies=new Map();for(const v of w.villages||[]){const res=Object.fromEntries(RESOURCES.map(k=>[k,0]));tallies.set(String(v.id),{res,marketGold:0,walletGold:0,pop:0,buildings:0,tiles:0});}
 for(const t of w.map.tiles||[]){if(t.ownerId===null||t.ownerId===undefined)continue;const n=String(t.ownerId),b=tallies.get(n);if(!b){errors.push('TILE_BAD_OWNER:'+t.id);continue;}b.tiles++;b.buildings+=(t.buildings||[]).length;b.marketGold+=N(t.v29Economy?.marketGold);for(const k of RESOURCES)b.res[k]+=N(t.stocks?.[k]);if(!byId.has(t.settlementId))errors.push('TILE_NO_SETTLEMENT:'+t.id);}
 for(const v of w.villages||[]){const b=tallies.get(String(v.id));for(const p of v.residents||[]){if(!p||p.alive===false)continue;b.pop++;b.walletGold+=N(p.gold29);if(!w.map.get(Number(p.homeTileId))||!same(w.map.get(Number(p.homeTileId)).ownerId,v.id))errors.push('PERSON_HOME_OWNER:'+p.id);}}
 for(const r of rows){const n=String(r.nationId),b=tallies.get(n);if(!b){errors.push('BAD_SETTLEMENT_NATION:'+r.settlementId);continue;}for(const id of r.tileIds){if(claimed.has(id))errors.push('DUP_TILE:'+id);claimed.add(id);const t=w.map.get(id);if(!t||!same(t.ownerId,r.nationId)||!same(t.settlementId,r.settlementId))errors.push('WRONG_TILE:'+id);}
  if(r.population!==r.housing.residents)errors.push('INTERNAL_POP:'+r.settlementId);
 }
 for(const [nid,b] of tallies){const rr=rows.filter(r=>String(r.nationId)===nid),sum=k=>rr.reduce((a,r)=>a+k(r),0);if(sum(r=>r.tiles)!==b.tiles)errors.push('TILES:'+nid);if(sum(r=>r.population)!==b.pop)errors.push('POP:'+nid);if(sum(r=>r.buildings)!==b.buildings)errors.push('BUILDINGS:'+nid);
  for(const k of RESOURCES)if(Math.abs(sum(r=>r.resources[k])-b.res[k])>1e-6)errors.push('RESOURCE:'+nid+':'+k);
  if(Math.abs(sum(r=>r.finance.marketGold)-b.marketGold)>1e-6)errors.push('MARKET_GOLD:'+nid);
  if(Math.abs(sum(r=>r.finance.walletGold)-b.walletGold)>1e-6)errors.push('WALLET_GOLD:'+nid);
 }
 return {ok:!errors.length,errors,settlements:rows.length,claimedTiles:claimed.size,people:rows.reduce((s,r)=>s+r.population,0),resources:RESOURCES.slice()};
}
const columns=['settlementId','nationId','nationName','coreTileId','tiles','tileIds','population','children','age15Plus','age16Plus','age18Plus','pioneers','activeMilitary','assignedJobs','workersAtTile','inboundCommuters','outboundCommuters','housingCapacity','overcrowdedTiles','housingShortage','buildings','conditionAverage','conditionBelow70','conditionInactive','marketGold','walletGold',...RESOURCES.map(k=>'stock_'+k)];
function csv(w){const rows=all(w),q=x=>'"'+String(x??'').replace(/"/g,'""')+'"',data=[columns.map(q).join(',')];for(const r of rows){const d={...r,...r.people,...r.finance,children:r.people.children,workersAtTile:r.people.workplaces,housingCapacity:r.housing.capacity,overcrowdedTiles:r.housing.overcrowdedTiles,housingShortage:r.housing.shortage,conditionAverage:r.condition.average,conditionBelow70:r.condition.below70,conditionInactive:r.condition.inactive,tileIds:r.tileIds.join('|')};for(const k of RESOURCES)d['stock_'+k]=r.resources[k];data.push(columns.map(k=>q(d[k])).join(','));}return data.join('\n');}
function download(filename,content,type){const u=URL.createObjectURL(new Blob([content],{type:type||'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=oldSerialize.call(this);data.version=VERSION;return data;};
NS.World.from=function(data){
 if(!data||data.version!==VERSION)throw Error('V0.34D1 저장 파일만 지원합니다.');
 const w=oldFrom({...data,version:PREVIOUS});
 // Older inherited loaders initialize missing fields and may re-run old founder/building
 // migrations. D1 is a current-schema save: its stored physical facts are authoritative.
 if(Array.isArray(data.map?.tiles))for(const source of data.map.tiles){const t=w.map.get(source.id);if(!t)continue;
  for(const key of ['buildings','buildingCondition','buildingAbandonSeasons','buildingRuins','buildingRepairProgress','stocks','v29Economy','developedBuildSpace'])
   if(Object.prototype.hasOwnProperty.call(source,key))t[key]=JSON.parse(JSON.stringify(source[key]));
 }
 if(Array.isArray(data.villages))for(const sv of data.villages){const v=nation(w,sv.id);if(!v||!Array.isArray(sv.residents))continue;
  const byId=new Map((v.residents||[]).map(p=>[String(p.id),p]));
  for(const sp of sv.residents){const p=byId.get(String(sp.id));if(!p)continue;
   for(const [key,val] of Object.entries(sp)){
    if(key==='_v26Owner'||key==='_v26Hooked'||key==='_v26ResidentCache')continue;
    try{p[key]=val&&typeof val==='object'?JSON.parse(JSON.stringify(val)):val;}catch(_){}
   }
  }
 }
 // Restoring a save must not append legacy migration/recon observations.
 if(data.telemetry&&w.telemetry){for(const [key,val] of Object.entries(data.telemetry))
  w.telemetry[key]=val&&typeof val==='object'?JSON.parse(JSON.stringify(val)):val;
 }
 return w;
};
const oldSave=NS.SaveSystem;NS.SaveSystem={...oldSave,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const data=localStorage.getItem(SAVE_KEY);return data?NS.World.from(JSON.parse(data)):null;},
 export(w){download(`village-observer-v034D1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){const s=w.telemetry.snapshotsCSV(),check=NS.V032E14?.validateCSV?.(s);if(check&&!check.ok)throw Error('D1 Legacy CSV 열 검증 실패');download(`village-observer-v034D1-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+s);},
 exportDevCSVV2(w){const s=NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),check=NS.V032E14?.validateCSV?.(s);if(check&&!check.ok)throw Error('D1 CSV V2 열 검증 실패');download(`village-observer-v034D1-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+s);},
 exportSettlementCSV(w){const rows=all(w),check=audit(w,rows);if(!check.ok)throw Error('Settlement D1 audit failed: '+check.errors.slice(0,8).join(','));download(`village-observer-v034D1-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w),rows=all(w),check=audit(w,rows);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d1Revision='settlement-aggregate-read-only-v1';d.worldSummary.v034d1Aggregate={...check,multiTile:rows.filter(r=>r.tiles>1).length};}return d;};
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=oldSnapshot.call(this,w,...args);if(s){const rows=NS.V034D1.all(w),x=audit(w,rows);Object.assign(s.global,{d1SettlementCount:rows.length,d1AggregateErrors:x.errors.length,d1OvercrowdedTileCount:rows.reduce((a,r)=>a+r.housing.overcrowdedTiles,0),d1InactiveBuildings:rows.reduce((a,r)=>a+r.condition.inactive,0)});}return s;};
function addButton(){const legacy=document.getElementById('exportLogCsvV2Btn')||document.getElementById('exportLogCsvBtn');if(!legacy||document.getElementById('exportSettlementCsvD1Btn'))return;const b=document.createElement('button');b.id='exportSettlementCsvD1Btn';b.textContent='Settlement CSV';b.title='다중 타일 Settlement 전체 집계 (D1)';b.addEventListener('click',()=>{try{const w=window.villageObserver?.world;if(!w)throw Error('세계가 없습니다.');NS.SaveSystem.exportSettlementCSV(w);}catch(e){console.error(e);alert('Settlement CSV 오류: '+e.message);}});legacy.insertAdjacentElement('afterend',b);}
if(NS.UI){const oldTile=NS.UI.prototype.renderTile,oldHead=NS.UI.prototype.renderHeader,oldContent=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderTile=function(...args){const v=oldTile.apply(this,args),w=this.world,t=w?.map?.get(w.selectedTileId),root=this.q?.('tileInspector');if(!t||!root||t.ownerId==null)return v;
 const s=aggregate(w,t.settlementId);if(!s)return v;const old=root.querySelector?.('.v34c-settlement-tile');if(old)old.remove();let box=root.querySelector?.('.v34d1-settlement-detail');if(!box){box=document.createElement('div');box.className='v34d1-settlement-detail';root.appendChild(box);}
 const stocks=RESOURCES.map(k=>`${({food:'식량',wood:'목재',stone:'석재',iron_ore:'철광석',iron:'철',tools:'도구'})[k]} ${F(s.resources[k])}`).join(' · ');
 box.innerHTML=`<strong>🏘️ Settlement ${esc(s.settlementId)}</strong><div class="small muted">중심 #${s.coreTileId} · 구성 ${s.tiles}타일 (#${s.tileIds.join(', #')})</div><div class="small">인구 <b>${s.population}</b>명 · 주거 <b>${F(s.housing.capacity)}</b>명분 · 과밀 타일 ${s.housing.overcrowdedTiles}개<br>건물 ${s.buildings}개 · 평균 상태 ${F(s.condition.average)} · 비활성 ${s.condition.inactive}개<br>근무 위치 ${s.people.workplaces}명 · 내부 유입 ${s.people.inboundCommuters}명 · 외부 통근 ${s.people.outboundCommuters}명<br>${stocks}<br>시장 ${F(s.finance.marketGold)}G · 주민 지갑 ${F(s.finance.walletGold)}G</div>`;return v;};
 NS.UI.prototype.renderVillageContent=function(...a){const out=oldContent.apply(this,a);if(this.sub!=='settlements')return out;const w=this.world,v=w?.selectedNation,root=this.q?.('villageContent');if(!v||!root)return out;
 const prepared=prepare(w),rows=activeRecords(w).filter(r=>same(r.nationId,v.id)).map(r=>aggregate(w,r.id,prepared));let el=root.querySelector?.('.v34d1-settlement-overview');if(!el){el=document.createElement('div');el.className='v34d1-settlement-overview';root.insertAdjacentElement('afterbegin',el);}const pop=rows.reduce((a,r)=>a+r.population,0),vac=rows.reduce((a,r)=>a+r.housing.capacity,0);el.innerHTML=`<strong>🏘️ D1 통합 Settlement</strong><div class="small muted">${rows.length}개 · 다중 타일 ${rows.filter(r=>r.tiles>1).length}개 · 주민 ${pop}명 · 주거 ${F(vac)}명분<br>소속 타일의 실제 물자·시설·근무 위치를 별도로 집계하며 정착지 사이의 물자 이동은 변경하지 않습니다.</div>`;return out;};
 NS.UI.prototype.renderHeader=function(){const r=oldHead.call(this);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent='.v34d1-settlement-detail,.v34d1-settlement-overview{margin:9px 0;padding:10px;border:1px solid #568c94;border-radius:10px;background:rgba(55,130,132,.10);line-height:1.65}.v34d1-settlement-detail strong,.v34d1-settlement-overview strong{color:#9cdfd7}';document.head?.appendChild(st);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Settlement Aggregate V1',summary:'다중 타일 Settlement의 인구·주거·노동·건물·6종 자원·시장 Gold를 읽기 전용으로 통합 조회합니다. 물리 재고·경제·AI·전투 규칙은 유지합니다.',sections:[['집계 API',['NS.V034D1.aggregate / all / audit로 실제 타일 위치와 주민·근무 위치를 별도 집계합니다.','같은 날 자원·주거·건물 상태가 변해도 이전 집계값을 재사용하지 않습니다.','관측 과정에서 기존 V29 노동 인덱스의 일자리 재조정을 호출하지 않습니다.']],['관측',['타일 정보창과 국가 정착지 정보에 D1 통합 정보를 표시합니다.','Settlement CSV를 별도로 제공하며 기존 1,683열 Legacy/V2 Snapshot CSV는 그대로 유지합니다.','정기 스냅샷에서 D1 집계 오류 수와 비활성 건물·과밀 타일 수를 기록합니다.']],['범위',['D2 주거 정책·D3 경제 정책은 변경하지 않습니다.','구버전 세이브 지원은 필수 요구사항이 아니며 D1 자체 저장·복원은 지원합니다.']]]});
NS.V034D1=Object.freeze({version:VERSION,resources:RESOURCES.slice(),prepare,aggregate,all,audit,csv,columns:columns.slice()});addButton();
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D1 initial header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034d1a.js */
/* V0.34D1A — labor measurement, not employment simulation. Observers never assign work. */
(function(NS){'use strict';
const VERSION='V0.34D1A',PREVIOUS='V0.34D1',SAVE_KEY='village-observer-v034d1a';
const CANDIDATE_FIELDS=['civilianEligible15','occupationTagged15','unemployed15','slotKeyTagged15','facilitySlotAssigned15','informalSlotAssigned15','workTileAssigned15','nonFacilityOccupation15','outboundWorkAssigned15','inboundWorkAssigned15','workLocationOtherTile15','workLocationForeign15','workTileDangling15','militaryExcluded15','pioneerExcluded15','slotStructuralWarnings'];
const n=x=>{const t=Number(x);return Number.isFinite(t)?t:0;};
const same=(a,b)=>String(a)===String(b);
const workId=p=>p.workTileId!==null&&p.workTileId!==undefined&&p.workTileId!==''&&Number.isInteger(Number(p.workTileId))?Number(p.workTileId):null;
const isMilitary=p=>p.militaryStatus32A==='active'||p.militaryActive32B===true;
const eligible=p=>p&&p.alive!==false&&n(p.age)>=15&&p.assignment!=='PIONEER'&&!isMilitary(p);
const occupied=p=>Boolean(p.job)&&!['무직','실업','아이'].includes(p.job);
const SLOT_JOB={farmstead:'농부',ancient_farm:'농부',sawmill:'목수',quarry:'광부',deep_quarry:'광부',iron_mine:'광부',smelter:'철공',smithy:'철공',market:'상인',grand_market:'상인',trading_post:'상인',merchant_guild:'상인',harbor:'상인',schoolhouse:'학자'};
function residentPeople(w,settlement,prep){const m=prep?.byNation?.get(String(settlement.nationId));if(!m)return[];const out=[];for(const tid of settlement.tileIds)for(const p of m.peopleByHome.get(Number(tid))||[])out.push(p);return out;}
function newMetrics(){return Object.fromEntries(CANDIDATE_FIELDS.map(x=>[x,0]));}
// Read-only structural check, deliberately avoiding V029.laborIndex() and cached labor rebuild.
// Index < 0 is an informal V29 slot; index >= 0 refers to a physical building.
function slotInfo(w,p){const key=p._v29SlotKey;if(typeof key!=='string'||!key)return {kind:'none',valid:false};
 const parts=key.match(/^(\d+):(-?\d+):(.+)$/);if(!parts)return {kind:'badKey',valid:false};
 const tid=Number(parts[1]),idx=Number(parts[2]),job=parts[3],t=w.map.get(tid);
 if(!t||!same(t.ownerId,p.villageId)||workId(p)!==tid||String(p.job)!==job)return {kind:'mismatch',valid:false,key};
 if(idx<0){const passable=NS.TERRAIN?.[t.terrain]?.passable!==false;const v=(w.villages||[]).find(v=>same(v.id,p.villageId));
  const hasFarm=(t.buildings||[]).some(x=>['farmstead','ancient_farm'].includes(x));
  const hasMine=(t.buildings||[]).some(x=>['quarry','deep_quarry','iron_mine'].includes(x));
  const hasTrade=(t.buildings||[]).some(x=>['market','grand_market','trading_post','merchant_guild','harbor'].includes(x));
  if(passable&&((idx===-1&&job==='농부'&&!hasFarm)||(idx===-2&&job==='광부'&&!hasMine)||(idx===-3&&job==='상인'&&!hasTrade&&Number(v?.coreTileId)===tid)))return {kind:'informal',valid:true,key};
  return {kind:'badInformal',valid:false,key};}
 if(!Array.isArray(t.buildings)||!t.buildings[idx]||n(t.buildingCondition?.[idx]??100)<=0)return {kind:'missingBuilding',valid:false,key};
 if(n(p.workBuildingIndex29)!==idx||String(p.workBuildingType29)!==String(t.buildings[idx])||SLOT_JOB[t.buildings[idx]]!==job)return {kind:'buildingMismatch',valid:false,key};
 return {kind:'facility',valid:true,key};
}
function calc(w,r,prep){const out=newMetrics();const members=new Set(r.tileIds.map(Number));for(const p of residentPeople(w,r,prep)){
 if(n(p.age)<15)continue;
 if(p.assignment==='PIONEER')out.pioneerExcluded15++;
 if(isMilitary(p))out.militaryExcluded15++;
 if(!eligible(p))continue;
 out.civilianEligible15++;
 if(occupied(p))out.occupationTagged15++;
 if(p.job==='무직'||p.job==='실업')out.unemployed15++;
 const wid=workId(p),info=slotInfo(w,p),hasKey=Boolean(p._v29SlotKey);
 if(hasKey){out.slotKeyTagged15++;if(info.valid){if(info.kind==='facility')out.facilitySlotAssigned15++;else if(info.kind==='informal')out.informalSlotAssigned15++;}else out.slotStructuralWarnings++;}
 else if(occupied(p))out.nonFacilityOccupation15++;
 if(wid!==null){out.workTileAssigned15++;if(wid!==Number(p.homeTileId))out.workLocationOtherTile15++;
  const target=w.map.get(wid);if(!target||target.ownerId===null||target.ownerId===undefined)out.workTileDangling15++;
  if(!target||!same(target.ownerId,r.nationId))out.workLocationForeign15++;
  if(!members.has(wid)||!target||!same(target.ownerId,r.nationId))out.outboundWorkAssigned15++;
 }
 }
 // Incoming *eligible* people may live in another Settlement or nation.
 for(const [nid,z] of prep.byNation||[])for(const tid of r.tileIds)for(const p of z.peopleByWork.get(Number(tid))||[]){
  if(eligible(p)&&(!same(nid,r.nationId)||!members.has(Number(p.homeTileId))))out.inboundWorkAssigned15++;
 }
 return out;
}
function prepare(w){return NS.V034D1.prepare(w);}
function aggregate(w,id,prepared){const r=NS.V034D1.aggregate(w,id,prepared);if(!r)return null;
 return {...r,labor:calc(w,r,prepared?.world===w?prepared:prepare(w))};}
function all(w){const prep=prepare(w);return NS.V034D1.all(w,prep).map(r=>({...r,labor:calc(w,r,prep)}));}
const SUM_FIELDS=CANDIDATE_FIELDS.filter(k=>k!=='slotStructuralWarnings');
function audit(w,rows){const base=NS.V034D1.audit(w,(rows||all(w)).map(({labor,...base})=>base));const errors=[...base.errors],warnings=[];rows=rows||all(w);
 // Independent nation-wide sweep: do not rely on Settlement resident indexes or calculated row counters.
 const expected=new Map(),expectedInbound=new Map();for(const v of w.villages||[]){const raw=newMetrics();for(const p of v.residents||[]){if(!p||p.alive===false||n(p.age)<15)continue;
  if(p.assignment==='PIONEER')raw.pioneerExcluded15++;if(isMilitary(p))raw.militaryExcluded15++;
  if(!eligible(p))continue;raw.civilianEligible15++;if(occupied(p))raw.occupationTagged15++;
  if(p.job==='무직'||p.job==='실업')raw.unemployed15++;
  const info=slotInfo(w,p),hasKey=Boolean(p._v29SlotKey),wid=workId(p);
  if(hasKey){raw.slotKeyTagged15++;if(info.valid){if(info.kind==='facility')raw.facilitySlotAssigned15++;else raw.informalSlotAssigned15++;}else raw.slotStructuralWarnings++;}
  else if(occupied(p))raw.nonFacilityOccupation15++;
  if(wid!==null){raw.workTileAssigned15++;if(wid!==Number(p.homeTileId))raw.workLocationOtherTile15++;
   const target=w.map.get(wid);if(!target||target.ownerId==null)raw.workTileDangling15++;
   if(!target||!same(target.ownerId,v.id))raw.workLocationForeign15++;
   const home=w.map.get(Number(p.homeTileId)),homeSid=home?.settlementId,targetSid=target?.settlementId;
   if(!target||!same(target.ownerId,v.id)||!same(targetSid,homeSid))raw.outboundWorkAssigned15++;
   if(target?.ownerId!=null&&targetSid!=null&&(!same(v.id,target.ownerId)||!same(homeSid,targetSid)))
    expectedInbound.set(String(target.ownerId),(expectedInbound.get(String(target.ownerId))||0)+1);
  }
 }
 expected.set(String(v.id),raw);}
 for(const [nid,exp] of expected){const rs=rows.filter(x=>same(x.nationId,nid)),s=k=>rs.reduce((a,r)=>a+n(r.labor?.[k]),0);
  for(const k of SUM_FIELDS.filter(k=>k!=='inboundWorkAssigned15'))if(s(k)!==exp[k])errors.push('LABOR:'+nid+':'+k+':'+s(k)+'/'+exp[k]);
  if(s('inboundWorkAssigned15')!==(expectedInbound.get(nid)||0))errors.push('LABOR_INBOUND:'+nid+':'+s('inboundWorkAssigned15')+'/'+(expectedInbound.get(nid)||0));
 }
 // Cross-Settlement worker location must balance when foreign owners are included.
 const inbound=rows.reduce((a,r)=>a+n(r.labor?.inboundWorkAssigned15),0);
 const outboundInside=rows.reduce((a,r)=>a+n(r.labor?.outboundWorkAssigned15)-n(r.labor?.workTileDangling15),0);
 // Some work locations may belong to unowned/foreign-owner tiles; these are informational.
 if(inbound>outboundInside)warnings.push('LABOR_INBOUND_EXCEEDS_OUTBOUND:'+inbound+'/'+outboundInside);
 const structural=rows.reduce((s,r)=>s+n(r.labor?.slotStructuralWarnings),0);
 if(structural)warnings.push('SLOT_STRUCTURAL:'+structural);
 return {...base,ok:errors.length===0,errors,warnings,laborCandidates:rows.reduce((s,r)=>s+n(r.labor?.civilianEligible15),0),laborStructuralWarnings:structural};
}
const columns=[...NS.V034D1.columns,...CANDIDATE_FIELDS];
function csv(w){const rows=all(w),q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';const data=[columns.map(q).join(',')];for(const r of rows){const original={...r,...r.people,...r.finance,children:r.people.children,workersAtTile:r.people.workplaces,housingCapacity:r.housing.capacity,overcrowdedTiles:r.housing.overcrowdedTiles,housingShortage:r.housing.shortage,conditionAverage:r.condition.average,conditionBelow70:r.condition.below70,conditionInactive:r.condition.inactive,tileIds:r.tileIds.join('|'),...r.labor};for(const k of NS.V034D1.resources)original['stock_'+k]=r.resources[k];data.push(columns.map(k=>q(original[k])).join(','));}return data.join('\n');}
function download(filename,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
// Current-version-only saves; D1 loader's physical-fact round trip is reused.
const origSerialize=NS.World.prototype.serialize,origFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=origSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||d.version!==VERSION)throw Error('V0.34D1A 저장 파일만 지원합니다.');return origFrom({...d,version:PREVIOUS});};
// D1 deserializer returns a world whose serialize() now emits D1A.
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const str=localStorage.getItem(SAVE_KEY);return str?NS.World.from(JSON.parse(str)):null;},
 export(w){download(`village-observer-v034D1A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D1A-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D1A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const rows=all(w),check=audit(w,rows);if(!check.ok)throw Error('Settlement D1A 감사 오류: '+check.errors.slice(0,6).join(','));download(`village-observer-v034D1A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const origJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=origJSON.call(this,w),rows=all(w),check=audit(w,rows);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d1aRevision='labor-metric-clarification-readonly';d.worldSummary.v034d1aLaborAudit=check;}return d;};
// No new CSV V2 columns: D1A metrics are available through Settlement CSV and Devlog.
const origSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=origSnapshot.call(this,w,...args);if(s){const rows=all(w),check=audit(w,rows);Object.assign(s.global,{d1aLaborEligible:check.laborCandidates,d1aLaborErrors:check.errors.length,d1aLaborSlotWarnings:check.laborStructuralWarnings});}return s;};
if(NS.UI){const tile=NS.UI.prototype.renderTile,head=NS.UI.prototype.renderHeader,village=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderTile=function(...args){const out=tile.apply(this,args),w=this.world,t=w?.map?.get(w.selectedTileId),root=this.q?.('tileInspector');if(!t||t.ownerId==null||!root)return out;const base=root.querySelector?.('.v34d1-settlement-detail');if(!base)return out;const s=aggregate(w,t.settlementId);if(!s)return out;
  // Clarify raw V1 employment-field labels that are NOT counts of actual workers.
  base.innerHTML=base.innerHTML.replace(/근무 위치 (\d+)명 · 내부 유입 (\d+)명 · 외부 통근 (\d+)명/,'근무지 필드 $1명 · 외부 거주 배정 $2명 · 외부 근무지 배정 $3명 (연령 무관)');
  let el=base.querySelector?.('.v034d1a-labor');if(!el){el=document.createElement('div');el.className='v034d1a-labor';base.appendChild(el);}
  const a=s.labor;el.innerHTML=`<b>💼 D1A 노동 분류 (15세 이상 민간)</b><div class="small">후보 ${a.civilianEligible15} · 직업 표기 ${a.occupationTagged15} · 무직 ${a.unemployed15}<br>시설 슬롯 ${a.facilitySlotAssigned15} · 야외/임시 슬롯 ${a.informalSlotAssigned15} · 비시설 직업 ${a.nonFacilityOccupation15}<br>근무지 지정 ${a.workTileAssigned15} · 외부 배정 ${a.outboundWorkAssigned15} · 외부 유입 ${a.inboundWorkAssigned15}<br><span class="muted">실제 취업률·일일 생산량은 아님. 슬롯 구조 경고 ${a.slotStructuralWarnings}건.</span></div>`;
  return out;};
 NS.UI.prototype.renderVillageContent=function(...args){const out=village.apply(this,args);if(this.sub!=='settlements')return out;const v=this.world?.selectedNation,root=this.q?.('villageContent');if(!v||!root)return out;const el=root.querySelector?.('.v34d1-settlement-overview');if(!el)return out;
  const w=this.world,prep=prepare(w),rs=(w.v34b?.settlements||[]).filter(r=>r.lifecycle==='ACTIVE'&&same(r.nationId,v.id)&&r.tileIds?.length).map(r=>aggregate(w,r.id,prep)).filter(Boolean);const sum=k=>rs.reduce((a,r)=>a+n(r.labor[k]),0);let box=el.querySelector?.('.v034d1a-nation');if(!box){box=document.createElement('div');box.className='v034d1a-nation';el.appendChild(box);}
  box.innerHTML=`<div class="small"><b>D1A 노동 집계</b> · 민간 후보 ${sum('civilianEligible15')}명 · 유효 시설 슬롯 ${sum('facilitySlotAssigned15')}명 · 비시설 직업 ${sum('nonFacilityOccupation15')}명 · 외부 근무지 ${sum('outboundWorkAssigned15')}명</div>`;return out;};
 NS.UI.prototype.renderHeader=function(...args){const out=head.apply(this,args);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const b=document.getElementById('exportSettlementCsvD1Btn');if(b){b.textContent='Settlement CSV (D1A)';b.title='읽기 전용 노동 분류 및 통합 자원 (48열)';}return out;};
}
if(typeof document!=='undefined'){const st=document.createElement('style');st.textContent='.v034d1a-labor{margin-top:8px;padding-top:8px;border-top:1px dashed #598c94}.v034d1a-nation{margin-top:5px;padding-top:5px;border-top:1px dashed #598c94}';document.head?.appendChild(st);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(r=>r.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Labor Metrics Clarification',summary:'Settlement 노동 통계를 인구·직업 표기·근무지·실제 시설 슬롯으로 구분합니다. 노동 배정이나 생산 규칙은 변경하지 않습니다.',sections:[['노동 인구 분류',['15세 미만·개척 임무·현역 병력을 민간 노동 후보에서 구분합니다.','실제 시설 슬롯과 야외·임시 슬롯, 비시설 직업을 별도로 집계합니다.','직업 문자열 또는 근무지 필드만으로 실제 노동 투입을 주장하지 않습니다.']],['관측·무결성',['D1의 기존 Settlement CSV 32열을 보존하고 노동 16열을 추가합니다.','읽기 전용 독립 국가별 노동 감사와 슬롯 정합성 경고를 추가합니다.','기존 Snapshot CSV V2 1,683열은 유지합니다.']],['호환·범위',['D1A 자체 세이브 키·버전만 지원합니다.','D2에서 주거·노동 행동을 변경할 예정이며 D1A는 관측 패치입니다.']]]});
NS.V034D1A=Object.freeze({version:VERSION,prepare,aggregate,all,audit,csv,columns:columns.slice(),laborColumns:CANDIDATE_FIELDS.slice(),slotInfo,eligible});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D1A header',e);}
})(window.VSim);

;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('D1A_SETTLEMENT_LABOR',args[0],old,this,args):old.apply(this,args);};})(window.VSim);

;
/* H1B2 bundled source: v034d2.js */
/* Village Observer V0.34D2 · Unified civilian Settlement + construction slots.
 * Military Formation mobility and the exact physical tile for every building remain unchanged.
 * D3 will separately convert the goods/market logistics layer.
 */
(function(NS){'use strict';
const VERSION='V0.34D2',PREVIOUS='V0.34D1A',KEY='village-observer-v034d2';
const N=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b);
const housingTypes=new Set(['house','row_house','collective_house']);
const statuses={policy:'one-day civilian Settlement; physical buildings and military remain tile-based',construction:'unified national project slots'};
function projectCap(v){let cap=3;const pop=N(v?.population?.());if(pop>=25)cap++;if(pop>=60)cap++;if(v?.hasTech?.('ADMINISTRATION'))cap+=2;if(v?.hasTech?.('ENGINEERING'))cap+=2;if(v?.hasTech?.('URBANIZATION'))cap+=2;return Math.min(11,cap);}
function projectCount(v){return (v?.constructionProjects||[]).filter(p=>!p?.v17Marker).length+(v?.landDevelopmentProjects||[]).length+(v?.buildingUpgradeProjects||[]).length+(v?.specializationProjects||[]).length;}
function freeSlots(v){return Math.max(0,projectCap(v)-projectCount(v));}
function records(w){return(w?.v34b?.settlements||[]).filter(r=>r?.lifecycle==='ACTIVE'&&Array.isArray(r.tileIds)&&r.tileIds.length);}
// Tile carries canonical Settlement ID. Registry lookup is O(1), and automatically
// reflects same-day merges, splits, and conquest without keeping a stale member cache.
function record(w,tid){if(tid===null||tid===undefined)return null;const t=w?.map?.get?.(Number(tid));if(!t||t.ownerId==null||t.settlementId==null)return null;const sid=String(t.settlementId);const r=w?._v34bActive?.get?.(sid)||records(w).find(x=>eq(x.id,sid));if(!r||r.lifecycle!=='ACTIVE'||!r.tileIds?.some(x=>Number(x)===Number(tid))||!eq(r.nationId,t.ownerId))return null;return r;}
function sameSettlement(w,a,b,nid=null){if(a==null||b==null)return false;const x=record(w,a),y=record(w,b);return!!x&&!!y&&eq(x.id,y.id)&&(nid==null||eq(x.nationId,nid));}
function capAt(t){if(!t)return 0;let cap=0;for(let i=0;i<(t.buildings||[]).length;i++){const building=t.buildings[i],capacity=N(NS.BUILDINGS?.[building]?.capacity);if(capacity<=0)continue;const condition=N(t.buildingCondition?.[i]??100);cap+=capacity*(condition>=70?1:Math.max(0,Math.min(1,condition/70)));}return cap;}
function housingAt(v,w,tid){if(NS.V034D2A?.cachedHousing)return NS.V034D2A.cachedHousing(v,w,tid,()=>housingAtUncached(v,w,tid));return housingAtUncached(v,w,tid);}
function housingAtUncached(v,w,tid){const s=record(w,tid);if(!s||!eq(s.nationId,v?.id))return null;let population=0,capacity=0,adults=0;const ids=new Set(s.tileIds.map(Number));
 // Residents are counted by actual homeTileId. They may draw on the whole local housing pool.
 for(const id of s.tileIds)for(const p of v.tileResidents?.(Number(id))||[]){if(p.alive===false||!ids.has(Number(p.homeTileId)))continue;population++;if(N(p.age)>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active')adults++;}
 for(const id of s.tileIds)capacity+=capAt(w.map.get(Number(id)));
 return {settlementId:s.id,nationId:v.id,tileIds:s.tileIds.slice(),coreTileId:s.coreTileId,population,capacity,adults,shortage:Math.max(0,population-capacity),vacancy:Math.max(0,capacity-population),occupancy:population/Math.max(.1,capacity)};}
function context(v,w){const result=[];if(!v||!w)return result;for(const s of records(w)){if(!eq(s.nationId,v.id))continue;const h=housingAt(v,w,s.tileIds[0]);if(!h)continue;const tileRows=s.tileIds.map(id=>{const t=w.map.get(Number(id));return {id:Number(id),t,cap:capAt(t),residents:(v.tileResidents?.(Number(id))||[]).filter(p=>p.alive!==false).length};});result.push({...h,tileRows});}return result;}
function housingRows(v,w){return context(v,w).map(h=>({id:Number(h.coreTileId),t:w.map.get(Number(h.coreTileId)),pop:h.population,cap:Math.max(.1,h.capacity),free:h.vacancy,occupancy:h.occupancy,housingShortage:h.shortage,urbanity:0,rank:'',foodDays:N(v.settlementReserveDays?.(h.coreTileId)),settlementId:h.settlementId,adults:h.adults,tileRows:h.tileRows})).filter(x=>x.t);}
function quickHousing(v,w){const rows=housingRows(v,w),bad=rows.filter(r=>r.pop>0&&(r.occupancy>=1.12||r.housingShortage>=1));const max=Math.max(0,...rows.filter(r=>r.pop>0).map(r=>r.occupancy)),short=rows.reduce((s,r)=>s+r.housingShortage,0);return {rows,bad,max,short,pressure:bad.length>0,active:max>=1.18||short>=3,severe:max>=1.35||short>=8};}
function pendingInSettlement(v,h){const tiles=new Set(h.tileIds.map(Number));return [...(v.constructionProjects||[]).filter(p=>!p?.v17Marker&&N(NS.BUILDINGS?.[p.type]?.capacity)>0),...(v.buildingUpgradeProjects||[]).filter(p=>housingTypes.has(p?.to))].some(p=>tiles.has(Number(p.tileId??p.targetTileId)));}
function tileBusy(v,id){return [...(v.constructionProjects||[]).filter(p=>!p?.v17Marker),...(v.landDevelopmentProjects||[]),...(v.buildingUpgradeProjects||[]),...(v.specializationProjects||[])].some(p=>Number(p.tileId??p.targetTileId)===Number(id));}
function siteOrder(v,w,h){return h.tileRows.filter(r=>r.t&&eq(r.t.ownerId,v.id)&&!tileBusy(v,r.id)).sort((a,b)=>{
 const ar=NS.V017?.remainingSpace?.(v,a.t)??0,br=NS.V017?.remainingSpace?.(v,b.t)??0;
 // Prioritize physically available sites; buildings are *not* virtualized.
 return N(br)-N(ar)||b.residents-a.residents||a.id-b.id;
 });}
function housingBlocker(v,w,q){if(NS.V034D2A?.blocker)return NS.V034D2A.blocker(v,w,q);if(!q.bad?.length)return'NONE';const h=context(v,w).find(x=>x.shortage>0||x.occupancy>=1.12);if(!h)return'NONE';if(pendingInSettlement(v,h))return'HOUSING_PROJECT_QUEUE';if(freeSlots(v)<=0)return'PROJECT_CAP';const sites=siteOrder(v,w,h);const foot=N(NS.V017?.buildingFootprint?.('house')||1);
 if(sites.some(r=>N(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-6>=foot))return 'READY_FOR_HOUSING';if(sites.some(r=>N(NS.V017?.accessiblePotential?.(v,r.t)??0)>N(r.t.developedBuildSpace)+.05))return'LAND_DEVELOPMENT';return'SPACE_CAP';}
const diag={housingReviews:0,housingActions:0,housingSuppressedBySharedVacancy:0,housingProjectQueueBlocks:0,constructionSlotBlocks:0,constructionStarts:0,upgradeStarts:0,landStarts:0};
function resolveHousing(v,w,sourceId,reason='HOUSING34D2',proactive=false){const h=context(v,w).find(x=>x.tileIds.some(id=>Number(id)===Number(sourceId)))||context(v,w).sort((a,b)=>b.shortage-a.shortage)[0];diag.housingReviews++;if(!h||!h.population)return false;
 const needs=h.shortage>=1||h.occupancy>=1.12||(proactive&&h.occupancy>=.95);
 if(!needs){if(h.tileRows.some(r=>r.residents>r.cap)&&h.vacancy>0)diag.housingSuppressedBySharedVacancy++;return false;}
 if(pendingInSettlement(v,h)){diag.housingProjectQueueBlocks++;return false;}if(!freeSlots(v)){diag.constructionSlotBlocks++;return false;}
 const sites=siteOrder(v,w,h);
 // D2 only builds when the Settlement as a whole needs housing. No Person is forcibly moved.
 for(const r of sites)for(let i=0;i<(r.t.buildings||[]).length;i++){const from=r.t.buildings[i],to=from==='house'&&v.hasTech?.('URBAN_PLANNING')?'row_house':from==='row_house'&&v.hasTech?.('URBANIZATION')?'collective_house':null;if(!to)continue;const extra=Math.max(0,N(NS.V017?.buildingFootprint?.(to)||1)-N(NS.V017?.buildingFootprint?.(from)||1));if(N(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-6<extra)continue;
 if(v.startHousingUpgrade?.(w,r.id,i,reason+'_SETTLEMENT_UPGRADE')){diag.housingActions++;return true;}}
 const foot=N(NS.V017?.buildingFootprint?.('house')||1);
 for(const r of sites){if(N(NS.V017?.remainingSpace?.(v,r.t)??0)+1e-6<foot)continue;if(v.startConstruction?.(w,r.id,'house',reason+'_SETTLEMENT_HOUSE')){diag.housingActions++;return true;}}
 for(const r of sites){if(N(NS.V017?.accessiblePotential?.(v,r.t)??0)<=N(r.t.developedBuildSpace)+.05)continue;if(v.startLandDevelopment?.(w,r.id,reason+'_SETTLEMENT_LAND')){diag.housingActions++;return true;}}
 return false;
}
function audit(w){const errors=[],rows=contextAll(w),nations=new Map();for(const v of w.villages||[])nations.set(String(v.id),{pop:0,capacity:0});for(const r of rows){const x=nations.get(String(r.nationId));if(!x){errors.push('UNKNOWN_NATION:'+r.nationId);continue;}x.pop+=r.population;x.capacity+=r.capacity;
 if(r.tileRows.reduce((a,t)=>a+t.residents,0)!==r.population)errors.push('HOME:'+r.settlementId);
 if(Math.abs(r.tileRows.reduce((a,t)=>a+t.cap,0)-r.capacity)>1e-8)errors.push('CAPACITY:'+r.settlementId);
 }
 for(const v of w.villages||[]){const q=nations.get(String(v.id));if(q.pop!==v.residents.filter(p=>p.alive!==false).length)errors.push('NATION_POP:'+v.id);if(projectCount(v)>projectCap(v))errors.push('SLOT_OVERFLOW:'+v.id+':'+projectCount(v)+'/'+projectCap(v));}
 return {ok:errors.length===0,errors,settlements:rows.length,people:rows.reduce((s,r)=>s+r.population,0),housingCapacity:rows.reduce((s,r)=>s+r.capacity,0),slotCapByNation:(w.villages||[]).map(v=>({id:v.id,cap:projectCap(v),used:projectCount(v)}))};}
function contextAll(w){const r=[];for(const v of w.villages||[])r.push(...context(v,w).map(h=>({...h,nationId:v.id,nationName:v.name})));return r;}
function csv(w){const cols=['settlementId','nationId','nationName','tileIds','population','housingCapacityShared','housingDeficitShared','housingVacancyShared','overcrowdingLegacyTileTotal','activeProjectCountNation','projectCapNation'];const rows=[cols.join(',')];for(const h of contextAll(w)){const data=[h.settlementId,h.nationId,h.nationName,h.tileIds.join('|'),h.population,h.capacity,h.shortage,h.vacancy,h.tileRows.reduce((a,r)=>a+Math.max(0,r.residents-r.cap),0),projectCount(w.villages.find(v=>eq(v.id,h.nationId))),projectCap(w.villages.find(v=>eq(v.id,h.nationId)))];rows.push(data.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(','));}return rows.join('\n');}
// Four project types share the same actual national capacity, regardless of legacy subpath.
for(const [name,kind] of [['startConstruction','construction'],['startHousingUpgrade','upgrade'],['startLandDevelopment','land']]){
 const prev=NS.Village.prototype[name];if(!prev)continue;
 NS.Village.prototype[name]=function(...args){if(freeSlots(this)<=0){diag.constructionSlotBlocks++;return false;}const before=projectCount(this),out=prev.apply(this,args);const after=projectCount(this);if(out&&after>before){diag[kind+'Starts']=(diag[kind+'Starts']||0)+1;}return out;};
}
// Direct production and commercial specialization starts use their own guarded entry points.
NS.Village.prototype.buildHouse=function(w){const group=context(this,w).filter(r=>r.population>0).sort((a,b)=>b.shortage-a.shortage||b.occupancy-a.occupancy);for(const h of group){if(resolveHousing(this,w,h.coreTileId,'D2_HOUSING_POLICY',true))return true;}return false;};
// D1A preserved legacy/physical location data. D2 changes only the new settlement-level meaning.
const oldFarmUpgrade=NS.V033F5A4?.startFarmUpgrade;
if(oldFarmUpgrade)NS.V033F5A4.startFarmUpgrade=function(v,...args){if(freeSlots(v)<=0){diag.constructionSlotBlocks++;return false;}return oldFarmUpgrade(v,...args);};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034d2={revision:'settlement-civilian-24h-housing-construction-v1',sharedHousing:true,constructionSlotsV2:true};return d;};
NS.World.from=function(data){if(!data||data.version!==VERSION)throw Error('V0.34D2 저장 파일만 지원합니다.');return from({...data,version:PREVIOUS});};
function download(name,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const r=localStorage.getItem(KEY);return r?NS.World.from(JSON.parse(r)):null;},
 export(w){download(`village-observer-v034D2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D2-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D2-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const report=audit(w);if(!report.ok)throw Error('D2 Settlement 감사 실패: '+report.errors.join(','));download(`village-observer-v034D2-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D2-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d2Revision='shared-civilian-settlement-and-construction-slots-v1';d.worldSummary.v034d2Audit=audit(w);d.worldSummary.v034d2Counters={...diag};}return d;};
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const out=oldSnapshot.call(this,w,...args);if(out){const a=audit(w);Object.assign(out.global,{d2SettlementHousingDeficit:contextAll(w).reduce((t,r)=>t+r.shortage,0),d2SharedHousingAuditErrors:a.errors.length,d2NationalConstructionSlots:(w.villages||[]).reduce((t,v)=>t+projectCap(v),0)});for(const n of out.villages||[]){const v=w.villages.find(v=>eq(v.id,n.id));if(v){n.industryProjectCap31G=projectCap(v);n.d2ProjectSlots=projectCap(v);n.d2ActiveProjectCount=projectCount(v);n.d2SharedHousingDeficit=context(v,w).reduce((a,r)=>a+r.shortage,0);}}}return out;};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader,oldTile=NS.UI.prototype.renderTile,oldContent=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderHeader=function(...args){const result=oldHead.apply(this,args);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const nearby=document.getElementById('exportSettlementCsvD1Btn')||document.getElementById('exportLogCsvV2Btn');if(nearby&&!document.getElementById('exportSettlementHousingD2Btn')){const btn=document.createElement('button');btn.id='exportSettlementHousingD2Btn';btn.textContent='Settlement Housing CSV';btn.title='공동 주거·국가 건설 슬롯 11열 내보내기 (D2)';btn.addEventListener('click',()=>{try{NS.SaveSystem.exportSettlementHousingCSV(this.world);}catch(e){console.error(e);alert('D2 CSV 내보내기 오류: '+e.message);}});nearby.insertAdjacentElement('afterend',btn);}return result;};
 NS.UI.prototype.renderTile=function(...args){const result=oldTile.apply(this,args),t=this.world?.map?.get(this.world.selectedTileId),root=this.q?.('tileInspector');if(!t||t.ownerId==null||!root)return result;const v=this.world.villages.find(v=>eq(v.id,t.ownerId));const h=v&&housingAt(v,this.world,t.id);if(!h)return result;let box=root.querySelector('.v034d2-housing');if(!box){box=document.createElement('div');box.className='v034d2-housing';root.appendChild(box);}box.innerHTML=`<b>🏘️ D2 통합 생활권</b><div class="small">거주 ${h.population}명 · 공동 주거 ${h.capacity.toFixed(1)}명분 · 실질 부족 ${h.shortage.toFixed(1)}명분<br>같은 Settlement 민간 시설 접근은 1일 내 가능 · 건물과 군사 위치는 타일별 유지<br>국가 동시 공사 ${projectCount(v)} / ${projectCap(v)}개</div>`;return result;};
 NS.UI.prototype.renderVillageContent=function(...args){const result=oldContent.apply(this,args),v=this.world?.selectedNation,root=this.q?.('villageContent');if(!v||!root||!['overview','settlements','economy'].includes(this.sub))return result;let box=root.querySelector('.v034d2-summary');if(!box){box=document.createElement('div');box.className='v034d2-summary';root.insertAdjacentElement('afterbegin',box);}const hs=context(v,this.world),pop=hs.reduce((t,r)=>t+r.population,0),cap=hs.reduce((t,r)=>t+r.capacity,0),short=hs.reduce((t,r)=>t+r.shortage,0);box.innerHTML=`<b>🏗️ D2 Settlement 생활·건설</b><div class="small">공동 주거 ${pop}/${cap.toFixed(1)}명 · 실제 부족 ${short.toFixed(1)}명분 · ${hs.length} Settlement<br>국가 건설 동시 상한 <b>${projectCount(v)}/${projectCap(v)}</b> · 인구 및 행정·토목·도시화 기술 연동</div>`;return result;};
}
if(typeof document!=='undefined'){const css=document.createElement('style');css.textContent='.v034d2-housing,.v034d2-summary{margin:9px 0;padding:9px 11px;background:rgba(68,141,117,.09);border:1px solid rgba(76,175,143,.40);border-radius:9px;line-height:1.55}';document.head.appendChild(css);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Settlement Living Space + Construction Capacity',summary:'여러 타일의 Settlement를 하나의 민간 생활권으로 운영하며 건설 슬롯을 기본 3개, 기술 단계에 따라 최대 11개로 완화합니다.',sections:[['공동 생활권',['같은 Settlement의 주택은 타일 간 가상 이주 없이 공동으로 사용합니다.','주택은 실제 타일에 지으며 군사 유닛의 이동·전투·점령은 타일 단위를 유지합니다.','같은 Settlement의 민간 일자리 탐색에서 타일 간 경로 비용을 0으로 처리합니다.','민간 자원·시장 통합은 D3의 과제이며 이 버전의 실제 재고 이동 규칙은 보존합니다.']],['건설 슬롯',['기본 3, 인구 25/60 각 +1, ADMINISTRATION/ENGINEERING/URBANIZATION 각 +2, 총 최대 11입니다.','신축·주택 증축·토지 개발의 활성 프로젝트는 같은 슬롯 한도를 사용합니다.','건설 자재·Gold·노동일과 실제 건물 입지 조건은 변하지 않습니다.']],['관측 및 안전',['D2 공동 주거 부족량·건설 슬롯·집계 감사 및 별도 Housing CSV를 제공하며 기존 D1A 48열 CSV도 유지합니다.','D2 저장 파일만 현재 버전 저장/복원에 사용합니다.']]]});
NS.V034D2=Object.freeze({version:VERSION,projectCap,projectCount,freeSlots,record,sameSettlement,capAt,housingAt,context,contextAll,quickHousing,housingRows,housingBlocker,resolveHousing,audit,csv,diagnostics:diag});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D2 header',e);}
})(window.VSim);

;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('D2_HOUSING_AUDIT',args[0],old,this,args):old.apply(this,args);};})(window.VSim);

;
/* H1B2 bundled source: v034d2a.js */
/* Village Observer V0.34D2A · Housing Capacity & Shared Living Consistency.
 * Read-only capacity, shared Person housing strain and birth occupancy, actual
 * settlement-safe construction diagnostics. Does not pool physical goods.
 */
(function(NS){'use strict';
const VERSION='V0.34D2A',PREVIOUS='V0.34D2',KEY='village-observer-v034d2a';
const N=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b);
const counters={cacheHits:0,cacheMisses:0,houseReviewCalls:0,houseAttempts:0,houseStarts:0,houseRejected:0,houseSuppressed:0,legacyHousingPulseDelegations:0};
const cached=new WeakMap(),recentAttempts=new WeakMap();
function capAt(t){if(!t)return 0;let sum=0;for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i],cap=N(NS.BUILDINGS?.[b]?.capacity);if(cap<=0)continue;const condition=N(t.buildingCondition?.[i]??100);sum+=cap*(condition>=70?1:Math.max(0,Math.min(1,condition/70)));}return sum;}
// Legacy V0.10's *active* capacity is a different metric from effective capacity.
function activeCapAt(t){if(!t)return 0;let sum=0;for(let i=0;i<(t.buildings||[]).length;i++){const b=t.buildings[i],cap=N(NS.BUILDINGS?.[b]?.capacity);if(cap<=0)continue;const threshold=['town_hall','house','outpost'].includes(b)?15:N(NS.V09?.activeCondition||35);if(N(t.buildingCondition?.[i]??100)>=threshold)sum+=cap;}return sum;}
function housingFingerprint(w,s){let key='';for(const tid of s.tileIds){const t=w.map.get(Number(tid));if(!t){key+='!'+tid;continue;}key+='|'+tid+'/'+String(t.ownerId)+'/'+String(t.settlementId)+'/'+(t.buildings||[]).join('.')+'/'+(t.buildingCondition||[]).map(x=>N(x).toFixed(5)).join('.');}return key;}
// V0.26 hooks homeTileId and alive to _v26ResidentEpoch. A length check also catches births.
// Real structure changes are detected even on the same day, without persisting caches.
function cachedHousing(v,w,tid,compute){const s=NS.V034D2.record(w,tid);if(!s)return null;
 const day=N(w.calendarOrdinalDay?.()??w.ordinalDay?.()),epoch=N(v._v26ResidentEpoch),length=v.residents?.length||0,signature=housingFingerprint(w,s),token=`${day}:${epoch}:${length}:${s.tileIds.join('.')}:${signature}`;
 let byId=cached.get(w);if(!byId){byId=new Map();cached.set(w,byId);}
 const k=String(v.id)+':'+String(s.id),entry=byId.get(k);
 if(entry?.token===token){counters.cacheHits++;return entry.h;}
 counters.cacheMisses++;
 const base=compute();if(!base)return null;
 let active=0;for(const id of s.tileIds)active+=activeCapAt(w.map.get(Number(id)));
 const h={...base,activeCapacity:active,activeShortage:Math.max(0,base.population-active),activeOccupancy:base.population/Math.max(.1,active)};
 if(byId.size>256)byId.clear();byId.set(k,{token,h});return h;
}
function housingAt(v,w,tid){return NS.V034D2.housingAt(v,w,tid);}
function independentPhysicalCap(t){let sum=0;for(const [i,type] of (t?.buildings||[]).entries()){const def=NS.BUILDINGS?.[type];if(!(Number(def?.capacity)>0))continue;const condition=t.buildingCondition?.[i]??100;sum+=Number(def.capacity)*Math.min(1,Math.max(0,Number(condition)/70));}return sum;}
function audit(w){const errors=[],rows=NS.V034D2.contextAll(w),canonical=NS.V034D1.all(w),reference=new Map(canonical.map(r=>[String(r.settlementId),r]));let physicalCapacity=0,activeCapacity=0;
 for(const h of rows){const r=reference.get(String(h.settlementId));if(!r){errors.push('MISSING_D1:'+h.settlementId);continue;}
  const physical=h.tileIds.reduce((n,id)=>n+independentPhysicalCap(w.map.get(Number(id))),0);
  const localActive=h.tileIds.reduce((n,id)=>n+activeCapAt(w.map.get(Number(id))),0);
  physicalCapacity+=physical;activeCapacity+=localActive;
  if(Math.abs(physical-h.capacity)>1e-7)errors.push('PHYSICAL_CAP:'+h.settlementId+':'+physical+':'+h.capacity);
  if(Math.abs(r.housing.capacity-h.capacity)>1e-7)errors.push('D1_CROSS_CAP:'+h.settlementId+':'+r.housing.capacity+':'+h.capacity);
  const v=w.villages.find(v=>eq(v.id,h.nationId)),byHome=h.tileIds.reduce((n,id)=>n+(v?.tileResidents(Number(id))||[]).filter(p=>p.alive!==false).length,0);
  if(byHome!==h.population)errors.push('PERSON_HOME:'+h.settlementId);
  const actual=housingAt(v,w,h.tileIds[0]);if(Math.abs(N(actual?.activeCapacity)-localActive)>1e-7)errors.push('ACTIVE_CAP:'+h.settlementId);
 }
 const d2=NS.V034D2.audit(w);if(!d2.ok)errors.push(...d2.errors.map(x=>'D2:'+x));
 return {ok:errors.length===0,errors,settlements:rows.length,people:rows.reduce((a,h)=>a+h.population,0),capacity:rows.reduce((a,h)=>a+h.capacity,0),physicalCapacity,activeCapacity,capacityMismatchCount:errors.filter(x=>x.includes('CAP')).length,cacheHits:counters.cacheHits,cacheMisses:counters.cacheMisses};
}
function refusal(v,w,h,phase){if(!h||h.population<=0)return'NO_HOUSING_NEED';if(h.shortage<1&&h.occupancy<1.12&&h.occupancy<.95)return'NO_HOUSING_NEED';
 const tiles=new Set(h.tileIds.map(Number)),housingTypes=new Set(['house','row_house','collective_house']);
 const pending=[...(v.constructionProjects||[]),...(v.buildingUpgradeProjects||[])].some(p=>tiles.has(Number(p.tileId??p.targetTileId))&&(N(NS.BUILDINGS?.[p.type]?.capacity)>0||N(NS.BUILDINGS?.[p.to]?.capacity)>0));
 if(pending)return'HOUSING_PENDING';if(NS.V034D2.freeSlots(v)<=0)return'PROJECT_CAP';
 const sites=h.tileRows.filter(r=>r.t&&eq(r.t.ownerId,v.id));if(!sites.length)return'NO_SITE';
 const ready=sites.some(r=>!([...v.constructionProjects||[],...v.landDevelopmentProjects||[],...v.buildingUpgradeProjects||[]].some(p=>Number(p.tileId??p.targetTileId)===r.id))&&(N(NS.V017?.remainingSpace?.(v,r.t))>=N(NS.V017?.buildingFootprint?.('house')||1)));
 if(!ready){const development=sites.some(r=>N(NS.V017?.accessiblePotential?.(v,r.t))>N(r.t.developedBuildSpace)+.05);return development?'LAND_DEVELOPMENT_REQUIRED':'NO_SITE';}
 if(phase==='PRECHECK')return'SITE_READY_UNVERIFIED';
 const cost=NS.V08?.effectiveCost?.(v,'house');
 if(cost&&(N(v.wood)+1e-7<N(cost.wood)||N(v.stone)+1e-7<N(cost.stone)))return'MATERIAL_OR_ROUTE';
 if(cost&&N(v.gold)+N((v.territory||[]).size)*0<N(cost.gold))return'GOLD_OR_RESERVE';
 if((v.residents||[]).filter(p=>p.alive!==false&&p.age>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active').length===0)return'LABOR';
 return'START_REJECTED_OTHER';
}
function blocker(v,w,q){if(!q.bad?.length)return'NONE';const h=NS.V034D2.context(v,w).find(x=>x.population>0&&(x.shortage>=1||x.occupancy>=1.12));return h?refusal(v,w,h,'PRECHECK'):'NONE';}
// V0.28 housing pulse uses tile rows and historically can bypass E1's shared resolver.
function housingPulse(v,w){counters.legacyHousingPulseDelegations++;const stats=v.v28Stats||(v.v28Stats={migrationMoves:0,housingActions:0,foodMoves:0,foodMoved:0,foodBlocked:0,lastMigrationCalendar:-99999,lastHousingCalendar:-99999,lastFoodCalendar:-99999});const day=N(w.calendarOrdinalDay?.());if(day-N(stats.lastHousingCalendar)<30)return false;stats.lastHousingCalendar=day;
 const rows=NS.V034D2.context(v,w).filter(h=>h.population>0).sort((a,b)=>b.shortage-a.shortage||b.occupancy-a.occupancy);for(const h of rows){if(h.occupancy<.96&&h.shortage<=0)continue;const yes=NS.V034D2.resolveHousing(v,w,h.coreTileId,'V28_URBAN_SHARED',true);if(yes){stats.housingActions++;return true;}}return false;
}
// Record precisely that a physical construction was attempted and rejected, without dry-run expenditures.
// Intercept only settlement-directed housing starts; physical payment and RNG remain original.
const previousConstruction=NS.Village.prototype.startConstruction;
NS.Village.prototype.startConstruction=function(w,tileId,type,reason,...rest){const housing=type==='house'&&String(reason).includes('SETTLEMENT');const h=housing?housingAt(this,w,tileId):null;if(housing)counters.houseAttempts++;
 const outcome=previousConstruction.call(this,w,tileId,type,reason,...rest);
 if(housing){if(outcome)counters.houseStarts++;else counters.houseRejected++;let map=recentAttempts.get(w);if(!map){map=new Map();recentAttempts.set(w,map);}map.set(String(h?.settlementId||tileId),{calendarDay:N(w.calendarOrdinalDay?.()),result:outcome?'STARTED':refusal(this,w,NS.V034D2.context(this,w).find(x=>eq(x.settlementId,h?.settlementId)),'AFTER_REJECTION'),tileId,reason});}
 return outcome;
};
// Record housing upgrade / land development outcomes through their real entrypoints.
for(const [method,label] of [['startHousingUpgrade','UPGRADE'],['startLandDevelopment','LAND']]){
 const original=NS.Village.prototype[method];if(typeof original!=='function')continue;
 NS.Village.prototype[method]=function(w,tid,...args){const reason=String(args[method==='startHousingUpgrade'?1:0]||'');
  const track=reason.includes('SETTLEMENT')&&(reason.includes('HOUSING')||reason.includes('D2')||reason.includes('V28_URBAN'));
  const h=track?housingAt(this,w,tid):null;const ok=original.call(this,w,tid,...args);
  if(track){counters.houseAttempts++;if(ok)counters.houseStarts++;else counters.houseRejected++;
   let map=recentAttempts.get(w);if(!map){map=new Map();recentAttempts.set(w,map);}
   map.set(String(h?.settlementId||tid),{calendarDay:N(w.calendarOrdinalDay?.()),result:ok?label+'_STARTED':label+'_REJECTED',tileId:tid,reason});}
  return ok;};
}
function attempts(w){return [...(recentAttempts.get(w)?.entries()||[])].map(([settlementId,v])=>({settlementId,...v}));}
// The existing D2 blocker is now a conservative precheck, never promises that construction succeeds.
// Delegated at the call site to avoid shadowing D2's retained references.
const d2Meta=NS.V034D2;
// Save rules deliberately remain current-version-only.
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=oldSerialize.call(this);x.version=VERSION;x.v034d2a={revision:'capacity-person-shared-audit-v1',canonicalHousing:true,personStrainShared:true};return x;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error('V0.34D2A 저장 파일만 지원합니다.');return oldFrom({...data,version:PREVIOUS});};
function download(name,body,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const x=localStorage.getItem(KEY);return x?NS.World.from(JSON.parse(x)):null;},
 export(w){download(`village-observer-v034D2A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D2A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D2A-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D2A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const a=audit(w);if(!a.ok)throw Error('D2A 주거 감사 실패: '+a.errors.join('|'));download(`village-observer-v034D2A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){const a=audit(w);if(!a.ok)throw Error('D2A 주거 감사 실패: '+a.errors.join('|'));download(`village-observer-v034D2A-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));}
};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d2aRevision='housing-capacity-shared-person-consistency-hotfix';d.worldSummary.v034d2aAudit=audit(w);d.worldSummary.v034d2aDiagnostics={...counters,recentHousingAttempts:attempts(w)};}return d;};
if(NS.UI){const prevTile=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const out=prevTile.apply(this,args);const root=this.q?.('tileInspector'),box=root?.querySelector?.('.v034d2-housing');if(box&&box.innerHTML.includes('D2 통합 생활권'))box.innerHTML=box.innerHTML.replace('D2 통합 생활권','D2A 통합 생활권');return out;};}
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const out=prev.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementHousingD2Btn');if(btn)btn.title='D2A 검증된 Settlement 공동 주거 CSV 11열';}return out;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Housing Capacity & Shared Living Consistency Hotfix',summary:'회관·전초기지 및 개별 건물 상태를 반영한 공동 주거 계산을 복구하고, 일일 주거 스트레스·인구 변천 판단과 감사 기준을 통일합니다.',sections:[['주거 수용량',['양의 capacity를 가진 모든 건물을 주거에 포함합니다(회관·전초기지 포함).','건물별 상태를 개별 계산해 같은 종류의 정상 건물이 비활성 건물의 주거 수용량을 살리지 않도록 수정합니다.','D1A CSV·D2 Housing CSV·건물별 독립 계산을 교차 감사합니다.']],['Settlement 생활권',['일일 주거 스트레스, 이주 매력도, 연간 출생·질병 판단의 주거 점유율을 Settlement 공동 기준으로 통일합니다.','주거 계산은 일일 Person·구조 무효화 기반 캐시를 사용하며 실제 homeTileId와 군사·건물 위치는 유지합니다.']],['진단 및 안전',['선행 READY는 실제 건축 성공을 보장하지 않으므로 SITE_READY_UNVERIFIED로 구분합니다.','주거 목적 신축 시도의 성공·거절을 원인별로 기록하되 감사·진단은 자원이나 난수를 소비하지 않습니다.','건설 슬롯 3~11, 물류와 자원·Gold·전쟁 규칙은 유지합니다.']]]});
NS.V034D2A=Object.freeze({version:VERSION,capAt,activeCapAt,cachedHousing,housingAt,audit,blocker,housingPulse,attempts,counters});
if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D2A header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034d2b.js */
/* Village Observer V0.34D2B — civilian Settlement consistency & housing diagnostics.
 * All per-attempt counters are observational; no extra payments, work or RNG.
 * Physical military movement, building sites and settlement economy remain unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.34D2B',PREVIOUS='V0.34D2A',SAVE_KEY='village-observer-v034d2b';
const attemptsByWorld=new WeakMap(), inProgress=new WeakMap();
const count={attempted:0,succeeded:0,rejected:0};
function get(w){let a=attemptsByWorld.get(w);if(!a){a={total:0,accepted:0,rejected:0,sameSettlementCandidatesSkipped:0,byType:{},byBlocker:{},last:[]};attemptsByWorld.set(w,a);}return a;}
function countInternalCandidate(w){if(w)get(w).sameSettlementCandidatesSkipped++;}
// Current housing strain is a Settlement-wide active capacity deficit, not an
// old cumulative housingStrainDays that may take weeks to recover after moving.
function currentHousingStrain(v,w,p){if(!p||p.alive===false)return false;const h=NS.V034D2A?.housingAt?.(v,w,p.homeTileId);return h? h.activeShortage>1e-7:false;}
function housingStatus(v,w){let currentlyStrained=0,residualHistory=0,historyDuringAdequateHousing=0;for(const p of v.residents||[]){if(p.alive===false)continue;const current=currentHousingStrain(v,w,p);if(current)currentlyStrained++;if(Number(p.housingStrainDays||0)>20){residualHistory++;if(!current)historyDuringAdequateHousing++;}}return {currentlyStrained,residualHistory,historyDuringAdequateHousing};}
// A legacy construction gate can directly report why it rejected a real start.
// This marker exists only while a tracked real attempt is on the call stack.
function markGate(v,w,tid,reason){const a=inProgress.get(v);if(a&&a.w===w&&Number(a.tid)===Number(tid))a.gate=reason;}
function detect(v,w,tid,kind,gate){if(gate)return gate;const t=w.map?.get?.(Number(tid));if(!t)return'NO_TILE';if(String(t.ownerId)!==String(v.id))return'FOREIGN_TILE';if(NS.V034D2?.freeSlots?.(v)<=0)return'PROJECT_CAP';
 const queued=[...(v.constructionProjects||[]),...(v.landDevelopmentProjects||[]),...(v.buildingUpgradeProjects||[]),...(v.specializationProjects||[])].some(p=>Number(p.tileId??p.targetTileId)===Number(tid));if(queued)return'SITE_PROJECT_PENDING';
 if(kind==='HOUSE'&&NS.V017?.remainingSpace&&NS.V017?.buildingFootprint&&Number(NS.V017.remainingSpace(v,t))+1e-6<Number(NS.V017.buildingFootprint('house')))return'NO_BUILD_SPACE';
 return kind==='HOUSE'?'UNRESOLVED_UPSTREAM_GATE':kind+'_UNRESOLVED_GATE';
}
function classify(v,w,tid,kind,reason,old,call){const track=kind==='HOUSE'?reason.includes('SETTLEMENT'):reason.includes('SETTLEMENT')&&(reason.includes('HOUSING')||reason.includes('D2')||reason.includes('V28_URBAN'));
 if(!track)return old();
 const before=inProgress.get(v),scope={w,tid,kind,reason,gate:null};inProgress.set(v,scope);let result;
 try{result=old();}finally{if(before)inProgress.set(v,before);else inProgress.delete(v);}
 const ok=Boolean(result),code=ok?'STARTED':detect(v,w,tid,kind,scope.gate),diag=get(w),type=diag.byType[kind]||(diag.byType[kind]={attempts:0,started:0,rejected:0});
 type.attempts++;diag.total++;count.attempted++;if(ok){type.started++;diag.accepted++;count.succeeded++;}else{type.rejected++;diag.rejected++;count.rejected++;diag.byBlocker[code]=(diag.byBlocker[code]||0)+1;}
 diag.last.push({calendarDay:Number(w.calendarOrdinalDay?.()??0),nationId:v.id,tileId:Number(tid),kind,result:code,reason});if(diag.last.length>36)diag.last.shift();return result;
}
// The previously installed D2A/D2/legacy methods are called exactly once.
for(const [method,kind] of [['startConstruction','HOUSE'],['startHousingUpgrade','UPGRADE'],['startLandDevelopment','LAND']]){
 const prev=NS.Village.prototype[method];if(typeof prev!=='function')continue;
 NS.Village.prototype[method]=function(w,tid,...args){const type=method==='startConstruction'?args[0]:null,why=String(args[method==='startConstruction'?1:method==='startHousingUpgrade'?1:0]||'');if(method==='startConstruction'&&type!=='house')return prev.call(this,w,tid,...args);return classify(this,w,tid,kind,why,()=>prev.call(this,w,tid,...args));};
}
function audit(w){const base=NS.V034D2A.audit(w),errors=[...base.errors],housing=NS.V034D2.contextAll(w),housingStrainByNation=[],byNation=new Map((w.villages||[]).map(v=>[String(v.id),{pop:0,strained:0}]));
 for(const h of housing){const nation=(w.villages||[]).find(v=>String(v.id)===String(h.nationId));if(!nation){errors.push('MISSING_NATION:'+h.nationId);continue;}const sum=byNation.get(String(h.nationId));sum.pop+=h.population;}
 for(const v of w.villages||[]){const s=housingStatus(v,w),nation=byNation.get(String(v.id));if(nation.pop!==v.residents.filter(p=>p.alive!==false).length)errors.push('PERSON_TOTAL:'+v.id);if(s.currentlyStrained>nation.pop)errors.push('STRAIN_OVERFLOW:'+v.id);nation.strained=s.currentlyStrained;housingStrainByNation.push({nationId:v.id,nationName:v.name,...s});}
 return {ok:errors.length===0,errors,people:base.people,settlements:base.settlements,capacity:base.capacity,capacityMismatchCount:base.capacityMismatchCount,housingCurrentStrained:[...byNation.entries()].map(([nationId,x])=>({nationId,...x})),housingStrainByNation,projectCap:base.ok};
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this);out.version=VERSION;out.v034d2b={revision:'civilian-settlement-consistency-diagnostics-v1'};return out;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error('V0.34D2B 저장 파일만 지원합니다.');return oldFrom({...data,version:PREVIOUS});};
function download(name,body,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(SAVE_KEY);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034D2B-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D2B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D2B-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D2B-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const a=audit(w);if(!a.ok)throw Error('D2B 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D2B-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){const a=audit(w);if(!a.ok)throw Error('D2B 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D2B-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));}
};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const result=prevJSON.call(this,w);result.version=VERSION;if(result.worldSummary){result.worldSummary.v034d2bRevision='civilian-settlement-consistency-and-housing-rejections';result.worldSummary.v034d2bAudit=audit(w);result.worldSummary.v034d2bHousingDiagnostics={...get(w)};}return result;};
if(NS.UI){const prevHeader=NS.UI.prototype.renderHeader,prevTile=NS.UI.prototype.renderTile;
 NS.UI.prototype.renderHeader=function(...args){const result=prevHeader.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementHousingD2Btn');if(btn)btn.title='D2B Settlement 공동 주거 11열 CSV';}return result;};
 NS.UI.prototype.renderTile=function(...args){const result=prevTile.apply(this,args),root=this.q?.('tileInspector'),label=root?.querySelector?.('.v034d2-housing');if(label)label.innerHTML=label.innerHTML.replace('D2A 통합 생활권','D2B 통합 생활권');return result;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Civilian Settlement Consistency & Housing Diagnostics',summary:'같은 Settlement의 불필요한 민간 이동을 막고, 실효 공동 주거 압박과 과거 누적 스트레스를 구분하며 주택·토지정비 착공의 실제 거절 게이트를 누적 추적합니다.',sections:[['생활권 일관성',['V0.28 내부 이주 후보에서 같은 Settlement의 타일 간 이동을 제외합니다.','V0.27 실제 일일 주거 스트레스·행복도도 공동 Settlement 주거 수용량을 사용합니다.','같은 Settlement 소속 타일을 별도 이주 목적지로 평가하지 않으며, 다른 Settlement 간 이주 매력도는 기존 규칙을 유지합니다.']],['집계·진단',['V0.28 주거 압박 통계는 공동 활성 수용량 부족 여부를 계산합니다. 기존 누적 스트레스는 D2B 진단에 따로 표시합니다.','공동 주거 건설·토지정비·개축 시도에 대해 착공 성공과 실패 원인(확인 가능한 실제 하위 게이트 포함)을 유형별로 누적합니다.','원인을 검증할 수 없는 차단은 UNRESOLVED로 보존하며 추정치를 확정 원인으로 꾸미지 않습니다.']],['기존 규칙',['건설 슬롯 3~11, 기존 Gold·자재·노동 소모와 기술 및 시장·물류 규칙을 보존합니다.','Snapshot CSV V2 1,683열, D1A Settlement CSV 48열, Housing CSV 11열을 유지합니다.']]]});
NS.V034D2B=Object.freeze({version:VERSION,audit,currentHousingStrain,housingStatus,attempts:w=>get(w),markGate,countInternalCandidate,count});
if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D2B header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034d3.js */
/* Village Observer V0.34D3 — physical-stock Settlement economy V1.
 * Same active, owned Settlement: civilian inventory, storage space and food
 * consumption are shared. Stocks, buildings and cash remain physical at tile.
 * Different Settlements retain transport constraints and conserved payments.
 * No food/terrain/harvest/consumption balance constants are modified.
 */
(function(NS){'use strict';
const VERSION='V0.34D3',PREVIOUS='V0.34D2B',KEY='village-observer-v034d3';
const RES=['food','wood','stone','iron_ore','iron','tools'];
const N=x=>Number.isFinite(Number(x))?Number(x):0;
const eq=(a,b)=>String(a)===String(b);
const meter=new WeakMap(),feeding=new WeakMap();
function stat(w){let s=meter.get(w);if(!s){s={sharedWithdrawCalls:0,sharedWithdrawQty:0,sharedDepositCalls:0,sharedDepositQty:0,avoidedSameSettlementTradePairs:0,marketGroupsNormalized:0,foodMealCalls:0,foodMealRequested:0,foodMealReceived:0,foodHarvestCalls:0,foodHarvestRequested:0,foodHarvested:0,foodNaturalRegenerated:0,foodDepositOverflow:0,marketGoldTransfers:0,marketGoldTransferQty:0,byTile:{}};meter.set(w,s);}return s;}
function tileStats(w,id){const s=stat(w);return s.byTile[id]||(s.byTile[id]={harvested:0,regen:0,consumed:0,mealDemand:0,depositOverflow:0});}
// D3B3: event-invalidated, physical Settlement membership cache.
// Only ownership, Settlement id and occupation state are watched. Stocks,
// Gold, buildings and Person objects remain live, never cached here.
const memberCache=new WeakMap(),memberScopes=new WeakMap(),tileWatch=new WeakMap();
function memberScope(w){let s=memberScopes.get(w);if(!s){s={epoch:0};memberScopes.set(w,s);}return s;}
function watchTile(w,t){if(tileWatch.get(t)===w)return true;
 const scope=memberScope(w);
 for(const key of ['ownerId','settlementId','v33OccupierId']){
  const d=Object.getOwnPropertyDescriptor(t,key);
  if(d&&!d.configurable)return false;
 }
 for(const key of ['ownerId','settlementId','v33OccupierId']){
  const d=Object.getOwnPropertyDescriptor(t,key),getter=d?.get,setter=d?.set;
  let value=getter?getter.call(t):t[key];
  Object.defineProperty(t,key,{configurable:true,enumerable:d?.enumerable??true,
   get(){return getter?getter.call(this):value;},
   set(next){const before=getter?getter.call(this):value;
    if(setter)setter.call(this,next);else if(!getter)value=next;
    const after=getter?getter.call(this):value;
    if(before!==after)scope.epoch++;
   }});
 }
 tileWatch.set(t,w);return true;
}
function members(v,id){const w=v?._world,tid=Number(id),t=w?.map?.get(tid);if(!t||!eq(t.ownerId,v.id))return null;
 const sid=t.settlementId;if(sid==null)return null;const rec=w._v34bActive?.get(String(sid))||(w.v34b?.settlements||[]).find(r=>eq(r.id,sid)&&r.lifecycle==='ACTIVE');
 if(!rec||!eq(rec.nationId,v.id)||rec.lifecycle!=='ACTIVE')return null;
 const scope=memberScope(w);let m=memberCache.get(rec);
 if(m&&m.source===rec.tileIds&&m.size===rec.tileIds.length&&m.core===Number(rec.coreTileId)&&m.nationId===v.id&&m.epoch===scope.epoch){return m.idSet.has(tid)?m:null;}
 const ids=[];let watched=true;
 for(const raw of rec.tileIds||[]){const mid=Number(raw),x=w.map.get(mid);if(x){if(!watchTile(w,x))watched=false;
  if(eq(x.ownerId,v.id)&&eq(x.settlementId,sid)&&!(x.v33OccupierId!=null&&!eq(x.v33OccupierId,v.id)))ids.push(mid);
 }}
 m={sid,ids,idSet:new Set(ids),core:Number(rec.coreTileId),nationId:v.id,source:rec.tileIds,size:(rec.tileIds||[]).length,epoch:watched?scope.epoch:-1};
 memberCache.set(rec,m);return m.idSet.has(tid)?m:null;
}
function sameSettlement(w,a,b,nationId){if(Number(a)===Number(b))return true;const x=w?.map?.get(Number(a)),y=w?.map?.get(Number(b));return !!(x&&y&&x.settlementId!=null&&eq(x.settlementId,y.settlementId)&&eq(x.ownerId,y.ownerId)&&(nationId==null||eq(x.ownerId,nationId))&&!(x.v33OccupierId!=null&&!eq(x.v33OccupierId,x.ownerId))&&!(y.v33OccupierId!=null&&!eq(y.v33OccupierId,y.ownerId)));}
function stockRaw(w,id,k){return Math.max(0,N(w?.map?.get(Number(id))?.stocks?.[k]));}
const oldStock=NS.Village.prototype.stockAt,oldCap=NS.Village.prototype.settlementCaps,oldDeposit=NS.Village.prototype.depositAt,oldWithdraw=NS.Village.prototype.withdrawAt;
function pool(v,tid,k){const m=members(v,tid);return m?m.ids.reduce((s,id)=>s+stockRaw(v._world,id,k),0):Math.max(0,N(oldStock.call(v,tid,k)));}
function physicalCap(v,tid,k){return Math.max(0,N(oldCap.call(v,tid)?.[k]));}
function capacity(v,tid,k){const m=members(v,tid);return m?m.ids.reduce((s,id)=>s+physicalCap(v,id,k),0):physicalCap(v,tid,k);}
// Preserve the raw tile getter for observers, transport receipts and audits.
NS.Village.prototype.stockAt=function(id,k){const m=members(this,id);if(!m||m.ids.length<2)return oldStock.call(this,id,k);return m.ids.reduce((s,tid)=>s+stockRaw(this._world,tid,k),0);};
NS.Village.prototype.settlementCaps=function(id){const raw=oldCap.call(this,id),m=members(this,id);if(!m||m.ids.length<2)return raw;const o={...raw};for(const k of RES)o[k]=0;for(const tid of m.ids){const tileCap=oldCap.call(this,tid);for(const k of RES)o[k]+=Math.max(0,N(tileCap?.[k]));}return o;};
// B3B: capture the D3A observer on the SAME transaction as physical withdrawal.
// This avoids a second members() call and a second raw-stock/capacity inspection
// by the former outer observer. No resource, RNG or policy changes.
NS.Village.prototype.withdrawAt=function(id,k,qty){
 const m=members(this,id),q=Math.max(0,N(qty)),w=this._world,observer=NS.V034D3A;
 const localBefore=observer&&m?.ids.length>1&&q>0?stockRaw(w,id,k):0;
 let got;
 if(!m||m.ids.length<2||!q){
  got=oldWithdraw.call(this,id,k,qty);
  const feed=feeding.get(w);
  if(k==='food'&&feed&&feed.v===this&&q>0){feed.requested+=q;feed.got+=got;tileStats(w,Number(id)).consumed+=got;tileStats(w,Number(id)).mealDemand+=q;}
 }else{
  let left=q;got=0;for(const tid of [Number(id),...m.ids.filter(x=>x!==Number(id))]){if(left<=1e-9)break;const take=oldWithdraw.call(this,tid,k,left);got+=take;left-=take;}
  const d=stat(w);d.sharedWithdrawCalls++;d.sharedWithdrawQty+=got;
  const feedingCtx=feeding.get(w);if(k==='food'&&feedingCtx&&feedingCtx.v===this){feedingCtx.requested+=q;feedingCtx.got+=got;tileStats(w,Number(id)).consumed+=got;tileStats(w,Number(id)).mealDemand+=q;}
 }
 observer?.observeWithdrawFast?.(w,this,id,k,qty,got,m,localBefore);
 return got;
};
NS.Village.prototype.depositAt=function(id,k,qty){
 const m=members(this,id),q=Math.max(0,N(qty)),w=this._world,observer=NS.V034D3A;
 const roomBefore=observer&&m?.ids.length>1&&q>0?Math.max(0,physicalCap(this,id,k)-stockRaw(w,id,k)):0;
 let got;
 if(!m||m.ids.length<2||!q){
  got=oldDeposit.call(this,id,k,qty);
  if(k==='food'&&w&&qty>got){stat(w).foodDepositOverflow+=Number(qty)-got;tileStats(w,Number(id)).depositOverflow+=Number(qty)-got;}
 }else{
  let left=q;got=0;for(const tid of [Number(id),...m.ids.filter(x=>x!==Number(id))]){if(left<=1e-9)break;const added=oldDeposit.call(this,tid,k,left);got+=added;left-=added;}
  const st=stat(w);st.sharedDepositCalls++;st.sharedDepositQty+=got;
  if(k==='food'&&q>got){st.foodDepositOverflow+=q-got;tileStats(w,Number(id)).depositOverflow+=q-got;}
 }
 observer?.observeDepositFast?.(w,this,id,k,qty,got,m,roomBefore);
 return got;
};
// Legacy food reserve is in three-day economic-cycle units (child .30, adult .42).
// All homes in a Settlement share one numerator AND one population-weighted denominator.
const oldDays=NS.Village.prototype.settlementReserveDays;
NS.Village.prototype.settlementReserveDays=function(id){const m=members(this,id);if(!m||m.ids.length<2)return oldDays.call(this,id);
 // V26's resident index invalidates on birth, death, relocation and roster
 // replacement; only the members' real residents are read, not the nation.
 const index=NS.V026?.ensureResidentIndex?.(this)?.byHome;let people=0,demand=0;
 if(index){for(const tid of m.ids){const rows=index.get(tid);if(!rows)continue;for(const p of rows){people++;demand+=N(p.age)<15?.30:.42;}}}
 else{const resident=new Set(m.ids);for(const p of this.residents||[]){if(p.alive===false||!resident.has(Number(p.homeTileId)))continue;people++;demand+=N(p.age)<15?.30:.42;}}
 if(!people)return 999;return pool(this,id,'food')/Math.max(.12,demand);
};
// Same-Settlement logistics is not a shipment, and does not require route capacity.
const oldLogistics=NS.Village.prototype.internalLogisticsCapacity;
NS.Village.prototype.internalLogisticsCapacity=function(a,b,k,construction){if(Number(a)!==Number(b)&&sameSettlement(this._world,a,b,this.id))return {capacity:0,cost:0,reason:'D3_SHARED_POOL_NO_SHIPMENT'};return oldLogistics.call(this,a,b,k,construction);};
// Physically conserved Market Gold transfers within the same Settlement. Called
// only by real V29 wages, settlement-to-settlement domestic trade and real
// international market purchase. No national Treasury or Person wallet is used.
function fundMarketGold(v,w,tid,needed){const m=members(v,tid),want=Math.max(0,N(needed));if(!m||m.ids.length<2||want<=1e-9)return 0;
 const receiver=w.map.get(Number(tid));if(!receiver?.v29Economy)return 0;let left=want,moved=0;
 for(const id of m.ids){if(id===Number(tid))continue;const source=w.map.get(id)?.v29Economy;if(!source)continue;const available=Math.max(0,N(source.marketGold)),take=Math.min(left,available);if(take<=0)continue;source.marketGold=available-take;receiver.v29Economy.marketGold=N(receiver.v29Economy.marketGold)+take;left-=take;moved+=take;if(left<=1e-9)break;}
 if(moved>0){const s=stat(w);s.marketGoldTransfers++;s.marketGoldTransferQty+=moved;}return moved;
}
// The real tile market liquidity is conserved. Identical Settlement members use
// the same scarcity ratio/quote inside the V29 civilian market and never trade
// goods against themselves merely because they occupy distinct tiles.
function harmonizeMarketRows(v,w,rows){const groups=new Map();for(const row of rows.values()){const m=members(v,row.id),key=m?.sid??('tile-'+row.id);let group=groups.get(key);if(!group){group=[];groups.set(key,group);}group.push(row);}
 for(const group of groups.values()){if(group.length<2)continue;const prices={},stock={},caps={},ratio={};for(const k of ['food','wood','stone']){stock[k]=group.reduce((a,r)=>a+stockRaw(w,r.id,k),0);caps[k]=group.reduce((a,r)=>a+physicalCap(v,r.id,k),0);ratio[k]=stock[k]/Math.max(1,caps[k]);prices[k]=group.reduce((a,r)=>a+N(r.prices[k])*Math.max(1,physicalCap(v,r.id,k)),0)/group.reduce((a,r)=>a+Math.max(1,physicalCap(v,r.id,k)),0);}
 for(const row of group){row.stock={...stock};row.caps={...caps};row.ratio={...ratio};row.prices={...row.prices,...prices};}stat(w).marketGroupsNormalized++;
 }}
const oldMetabolism=NS.Person.prototype.metabolism;
NS.Person.prototype.metabolism=function(v,w,...args){const prev=feeding.get(w),scope={v,p:this,requested:0,got:0};feeding.set(w,scope);try{return oldMetabolism.call(this,v,w,...args);}finally{if(prev)feeding.set(w,prev);else feeding.delete(w);if(scope.requested>0){const s=stat(w);s.foodMealCalls++;s.foodMealRequested+=scope.requested;s.foodMealReceived+=scope.got;}}};
const oldHarvest=NS.Tile.prototype.harvest;
NS.Tile.prototype.harvest=function(k,qty,day){const out=oldHarvest.call(this,k,qty,day);if(k==='food'){const w=NS._v32fActiveAct?.w||this._worldRef;if(w){const s=stat(w);s.foodHarvestCalls++;s.foodHarvestRequested+=Math.max(0,N(qty));s.foodHarvested+=out;tileStats(w,this.id).harvested+=out;}}return out;};
const oldSync=NS.Tile.prototype.syncResources;
NS.Tile.prototype.syncResources=function(day){const before=N(this.resources?.food),last=N(this.lastResourceDay);const out=oldSync.call(this,day),gain=Math.max(0,N(this.resources?.food)-before);if(gain>0&&N(day)>last){const w=NS._v32fActiveAct?.w||this._worldRef;if(w){stat(w).foodNaturalRegenerated+=gain;tileStats(w,this.id).regen+=gain;}}return out;};
function economyRows(w){const groups=NS.V034D1.all(w),out=[];for(const r of groups){const v=w.villages.find(x=>eq(x.id,r.nationId));if(!v)continue;const m=r.tileIds,foodDemand=(v.residents||[]).filter(p=>p.alive!==false&&m.some(id=>Number(id)===Number(p.homeTileId))).reduce((s,p)=>s+(N(p.age)<15?.30:.42),0);
 const baseRegen=m.reduce((s,id)=>s+N(NS.TERRAIN[w.map.get(Number(id))?.terrain]?.regen?.food),0),natural=m.reduce((s,id)=>s+N(w.map.get(Number(id))?.resources?.food),0);
 const cap={};for(const k of ['food','wood','stone'])cap[k]=m.reduce((s,id)=>s+physicalCap(v,id,k),0);
 const history=m.reduce((s,id)=>{const h=stat(w).byTile[Number(id)]||{};for(const k of ['harvested','regen','consumed','mealDemand','depositOverflow'])s[k]=(s[k]||0)+N(h[k]);return s;},{});
 out.push({...r,capacity:cap,foodDemand,foodReserveDays:foodDemand?r.resources.food/foodDemand:999,naturalFoodRemaining:natural,baseFoodRegenPerCycle:baseRegen,...history});
 }return out;}
function audit(w){const errs=[],warnings=[],rows=economyRows(w),d1=NS.V034D1.audit(w);if(!d1.ok)errs.push(...d1.errors.map(x=>'D1:'+x));
 const totals=Object.fromEntries(RES.map(k=>[k,0]));
 const accessibleTotals=Object.fromEntries(RES.map(k=>[k,0]));
 let occupiedMemberTiles=0,fullyBlockedSettlements=0,poolChecks=0;
 for(const r of rows){const v=w.villages.find(x=>eq(x.id,r.nationId));
  // Physical stock and civilian-accessible stock are different concepts during
  // hostile occupation. Use the same D3 members() predicate as real pool reads;
  // never move, grant, remove or normalize any physical resources here.
  const accessIds=r.tileIds.filter(id=>!!members(v,id));
  occupiedMemberTiles+=r.tileIds.length-accessIds.length;
  if(!accessIds.length)fullyBlockedSettlements++;
  for(const k of RES){
   const physical=r.tileIds.reduce((sum,id)=>sum+stockRaw(w,id,k),0);
   if(Math.abs(physical-r.resources[k])>1e-6)errs.push('STOCK:'+r.settlementId+':'+k);
   totals[k]+=physical;
   const accessible=accessIds.reduce((sum,id)=>sum+stockRaw(w,id,k),0);
   accessibleTotals[k]+=accessible;
   // A fully occupied Settlement offers no accessible pool; do not fall back
   // to stockAt(occupiedTile), which deliberately returns raw physical stock.
   const observed=accessIds.length?pool(v,accessIds[0],k):0;
   poolChecks++;
   if(Math.abs(observed-accessible)>1e-6)errs.push('POOL:'+r.settlementId+':'+k);
  }
  for(const k of ['food','wood','stone'])if(r.resources[k]-r.capacity[k]>1e-5)warnings.push('STORAGE_OVERFLOW:'+r.settlementId+':'+k);
 }
 for(const k of RES){const real=(w.map?.tiles||[]).filter(t=>t.ownerId!=null).reduce((sum,t)=>sum+stockRaw(w,t.id,k),0);if(Math.abs(real-totals[k])>1e-5)errs.push('WORLD_'+k);}
 return {ok:errs.length===0,errors:errs,warnings,settlements:rows.length,multiTile:rows.filter(r=>r.tiles>1).length,resources:totals,
  h1c3:{physical:totals,accessible:accessibleTotals,occupiedMemberTiles,fullyBlockedSettlements,poolChecks},
  foodNaturalPotential:rows.reduce((sum,r)=>sum+r.naturalFoodRemaining,0),foodBaseRegenPerCycle:rows.reduce((sum,r)=>sum+r.baseFoodRegenPerCycle,0)};
}
const COL=['settlementId','nationId','nationName','tileIds','population',...RES.map(k=>'stock_'+k),'foodStorageCapacity','woodStorageCapacity','stoneStorageCapacity','foodDemandPerCycle','foodReserveCycles','naturalFoodRemaining','baseFoodRegenPerCycle','foodHarvestedObserved','foodNaturalRegenObserved','mealFoodReceivedObserved','mealFoodRequestedObserved','foodDepositOverflowObserved','marketGold'];
function csv(w){const lines=[COL.join(',')],esc=x=>'"'+String(x??'').replace(/"/g,'""')+'"';for(const r of economyRows(w)){const o={...r,tileIds:r.tileIds.join('|'),foodStorageCapacity:r.capacity.food,woodStorageCapacity:r.capacity.wood,stoneStorageCapacity:r.capacity.stone,foodDemandPerCycle:r.foodDemand,foodReserveCycles:r.foodReserveDays,foodHarvestedObserved:r.harvested,foodNaturalRegenObserved:r.regen,mealFoodReceivedObserved:r.consumed,mealFoodRequestedObserved:r.mealDemand,foodDepositOverflowObserved:r.depositOverflow,marketGold:r.finance.marketGold};for(const k of RES)o['stock_'+k]=r.resources[k];lines.push(COL.map(k=>esc(o[k])).join(','));}return lines.join('\n');}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=oldSerialize.call(this);x.version=VERSION;x.v034d3={revision:'civilian-physical-settlement-economy-pooling',noFreeResources:true,baseRegenUnchanged:true};return x;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error('V0.34D3 저장 파일만 지원합니다.');return oldFrom({...data,version:PREVIOUS});};
function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const text=localStorage.getItem(KEY);return text?NS.World.from(JSON.parse(text)):null;},
 export(w){download(`village-observer-v034D3-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSV(w){download(`village-observer-v034D3-legacy-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+w.telemetry.snapshotsCSV());},
 exportDevCSVV2(w){download(`village-observer-v034D3-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){const a=audit(w);if(!a.ok)throw Error('D3 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D3-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){const a=audit(w);if(!a.ok)throw Error('D3 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D3-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){const a=audit(w);if(!a.ok)throw Error('D3 감사 실패 '+a.errors.join('|'));download(`village-observer-v034D3-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=oldJSON.call(this,w);out.version=VERSION;if(out.worldSummary){out.worldSummary.v034d3Revision='civilian-settlement-economy-physical-stock-pooling-v1';out.worldSummary.v034d3Audit=audit(w);const x=stat(w);out.worldSummary.v034d3FoodFlow={...x,byTile:undefined,mealUnserved:Math.max(0,x.foodMealRequested-x.foodMealReceived)};}return out;};
if(NS.UI){const codex=NS.UI.prototype.renderCodex;if(typeof codex==='function')NS.UI.prototype.renderCodex=function(...args){const result=codex.apply(this,args),root=this.q?.('codexContent');if(root&&root.innerHTML?.includes('자연회복/일'))root.innerHTML=root.innerHTML.replaceAll('자연회복/일','자연회복/3일 작업주기');return result;};}
if(NS.UI){const header=NS.UI.prototype.renderHeader,tile=NS.UI.prototype.renderTile,content=NS.UI.prototype.renderVillageContent;
 NS.UI.prototype.renderHeader=function(...args){const out=header.apply(this,args);if(typeof document==='undefined')return out;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const near=document.getElementById('exportSettlementHousingD2Btn')||document.getElementById('exportSettlementCsvD1Btn');if(near&&!document.getElementById('exportSettlementEconomyD3Btn')){const btn=document.createElement('button');btn.id='exportSettlementEconomyD3Btn';btn.textContent='Settlement Economy CSV';btn.title='D3 공동 자원·식량 흐름 CSV '+COL.length+'열';btn.addEventListener('click',()=>{try{NS.SaveSystem.exportSettlementEconomyCSV(this.world);}catch(e){console.error(e);alert('D3 CSV 오류: '+e.message);}});near.insertAdjacentElement('afterend',btn);}return out;};
 NS.UI.prototype.renderTile=function(...args){const out=tile.apply(this,args),id=this.world?.selectedTileId,t=this.world?.map?.get(id),v=this.world?.villages?.find(x=>eq(x.id,t?.ownerId)),root=this.q?.('tileInspector');if(!v||!root)return out;const m=members(v,id);if(!m)return out;let box=root.querySelector('.v034d3-economy');if(!box){box=document.createElement('div');box.className='v034d3-economy';root.appendChild(box);}const f=pool(v,id,'food'),days=v.settlementReserveDays(id),r=m.ids.reduce((s,tid)=>s+N(this.world.map.get(tid)?.resources?.food),0);box.innerHTML=`<b>🌾 D3 공동 경제권</b><div class="small">${m.ids.length}타일 · 식량 ${f.toFixed(1)} / 비축 ${days.toFixed(1)}작업주기 · 자연 식량 ${r.toFixed(1)}<br>목재 ${pool(v,id,'wood').toFixed(1)} · 석재 ${pool(v,id,'stone').toFixed(1)} · 철광 ${pool(v,id,'iron_ore').toFixed(1)}<br>시설·군사 위치는 타일별 유지 / 다른 Settlement 물류는 별도</div>`;return out;};
 NS.UI.prototype.renderVillageContent=function(...args){const out=content.apply(this,args),v=this.world?.selectedNation,root=this.q?.('villageContent');if(!v||!root||!['overview','settlements','economy'].includes(this.sub))return out;let box=root.querySelector('.v034d3-summary');if(!box){box=document.createElement('div');box.className='v034d3-summary';root.insertAdjacentElement('afterbegin',box);}const rows=economyRows(this.world).filter(r=>eq(r.nationId,v.id));const food=rows.reduce((s,r)=>s+r.resources.food,0),demand=rows.reduce((s,r)=>s+r.foodDemand,0);box.innerHTML=`<b>🌾 D3 Settlement 공동 자원·식량</b><div class="small">경제권 ${rows.length}개 · 저장 식량 ${food.toFixed(1)} · 평균 ${demand>0?(food/demand).toFixed(1):'∞'}작업주기 · 자연회복 기초 ${rows.reduce((s,r)=>s+r.baseFoodRegenPerCycle,0).toFixed(1)} / 3일<br>자원 자체 생성 없이 동일 Settlement 재고·창고 접근을 통합합니다.</div>`;return out;};
}
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent='.v034d3-economy,.v034d3-summary{margin:9px 0;padding:9px 11px;background:rgba(82,128,183,.09);border:1px solid rgba(82,128,183,.40);border-radius:9px;line-height:1.55}';document.head.appendChild(style);document.title='Village Observer '+VERSION;}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Settlement Economy Integration V1',summary:'같은 Settlement의 실제 식량·자재·저장 공간을 공동 이용하고 내부 가상 운송·거래를 배제합니다. 식량 수지 관측을 추가하며 기본 생산·소비·자연회복 수치는 유지합니다.',sections:[['공동 경제권',['동일 활성 Settlement 내 식량·목재·석재·철광석·철·도구 재고를 공동 이용합니다. 실제 재고는 개별 물리 타일에 보존됩니다.','건물과 군사 유닛은 기존 타일 단위로 남고, 다른 Settlement/국가 간 이동은 실제 물류 제약을 유지합니다.','같은 Settlement 내 별도 배송 및 국내 가격 차이로 발생하는 자기 거래는 실행하지 않습니다.']],['시장·식량',['기존 V0.29 민간 시장 평가에서 같은 Settlement의 재고 충족률과 가격 신호를 공유합니다. 임금·실제 시장 결제는 동일 Settlement 기존 Market Gold에서 보전되며 총액은 보존됩니다.','자연 식량 채집 요청·획득, 자연회복, 주민 식량 공급과 저장 초과를 관측합니다.','지형별 자연회복과 농업 채집 및 0.30/0.42 소비 수치를 변경하지 않습니다.']],['검증',['D3 24열 Settlement Economy CSV를 신규 제공하며 기존 Snapshot V2 1,683열, Settlement 48열, Housing 11열을 유지합니다.','D2B 특정 고정 시드 진행 중단 및 장기 전쟁·노후화 회귀는 계속 미해결 검증 항목입니다.']]]});
NS.V034D3=Object.freeze({version:VERSION,resources:RES,members,sameSettlement,pool,capacity,stockRaw,physicalCap,fundMarketGold,harmonizeMarketRows,economyRows,audit,csv,stats:w=>stat(w),noteIgnoredTradePair:w=>stat(w).avoidedSameSettlementTradePairs++});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D3 header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034d3a.js */
/* Village Observer V0.34D3A — conserved civilian harvest and causal 30-day food observation.
 * Original physical tile ownership, prices, production multipliers and consumption remain intact.
 * All flow observations are additive; no RNG and no daily all-person/tile rescan.
 */
(function(NS){'use strict';
const VERSION='V0.34D3A',PREVIOUS='V0.34D3',KEY='village-observer-v034d3a',D3=NS.V034D3;
const num=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b),EPS=1e-8;
const observ=new WeakMap(),harvestScope=new WeakMap(),transferScope=new WeakMap(),mealScope=new WeakMap();
const METRICS=['harvestRequested','harvestRaw','harvestProduced','harvestStored','harvestRestoredNatural','harvestRejectedOutput','harvestCalls','foodRegenObserved','depositRequested','depositAccepted','depositRejected','otherDeposited','otherWithdrawn','mealRequested','mealReceived','remoteFoodWithdrawn','remoteWoodWithdrawn','remoteStoneWithdrawn','remoteFoodDeposited','remoteWithdrawCalls','remoteDepositCalls','transferMoved','transferAccepted','transferReturned','transferUnrecovered','foodSpoiled','frontierFoodSpent'];
function freshRow(id,nid,name,ids){return {settlementId:String(id),nationId:String(nid),nationName:name||'',tileIds:(ids||[]).map(Number),openingFood:0,closingFood:0,openingNatural:0,closingNatural:0,openingCapacity:0,closingCapacity:0,population:0,foodLaborers:0,severeHunger:0,criticalHunger:0,foodReserveCycles:0,topologyChanged:false,...Object.fromEntries(METRICS.map(k=>[k,0]))};}
function group(w,v,tid){const m=D3.members(v,tid),sid=m?.sid??('tile-'+tid);return {id:String(sid),nationId:String(v.id),name:v.name||'',ids:m?.ids||[Number(tid)]};}
function calendar(w){return Math.max(1,num(w.calendarOrdinalDay?.()??(w.ordinalDay?.()*3)));}
function state(w){let s=observ.get(w);if(!s){s={startedOrdinal:calendar(w),windows:[],live:null,lastBucket:null,total:{foodSpoiled:0,frontierFoodSpent:0,harvestRequested:0,harvestRaw:0,foodRegenObserved:0,harvestProduced:0,harvestStored:0,harvestRestoredNatural:0,harvestRejectedOutput:0,transferAccepted:0,transferReturned:0,transferUnrecovered:0,remoteFoodWithdrawn:0,remoteWoodWithdrawn:0,remoteStoneWithdrawn:0,remoteFoodDeposited:0},periods:0};observ.set(w,s);}return s;}
function groupedPhysical(w){const rows=D3.economyRows(w),out=new Map();for(const r of rows){const x=freshRow(r.settlementId,r.nationId,r.nationName,r.tileIds);x.openingFood=x.closingFood=num(r.resources.food);x.openingNatural=x.closingNatural=num(r.naturalFoodRemaining);x.openingCapacity=x.closingCapacity=num(r.capacity.food);out.set(x.settlementId,x);}return out;}
function start(w){const s=state(w),ordinal=calendar(w),bucket=Math.floor((ordinal-1)/30);if(s.live&&s.lastBucket===bucket)return s;
 if(s.live){finish(w,s);}const rows=groupedPhysical(w);s.live={bucket,startOrdinal:bucket*30+1,endOrdinal:(bucket+1)*30,startedAtOrdinal:ordinal,groups:Object.fromEntries(rows),partialStart:ordinal>bucket*30+1};s.lastBucket=bucket;return s;}
function rowWithMembership(w,v,tid,m){
 let occupationLedger=false;
 // F1A: inventory access stays filtered on occupation. Ledger topology does not:
 // it groups all physical tiles of the same still-owned Settlement.
 if(m?.source&&m.ids.length!==m.source.length){
  occupationLedger=true;
  m={sid:m.sid,ids:m.source.map(Number)};
 }else if(!m){
  const tile=w.map.get(Number(tid)),sid0=tile?.settlementId;
  if(tile&&eq(tile.ownerId,v.id)&&sid0!=null){
   const rec=w._v34bActive?.get(String(sid0))||(w.v34b?.settlements||[]).find(x=>eq(x.id,sid0)&&x.lifecycle==='ACTIVE');
   if(rec&&eq(rec.nationId,v.id)&&rec.lifecycle==='ACTIVE'&&rec.tileIds.some(x=>Number(x)===Number(tid))){
    occupationLedger=tile.v33OccupierId!=null&&!eq(tile.v33OccupierId,v.id);
    m={sid:sid0,ids:rec.tileIds.map(Number)};
   }
  }
 }
 const s=start(w),sid=m?.sid??('tile-'+tid),id=String(sid),ids=m?.ids||[Number(tid)];let r=s.live.groups[id];
 if(!r){r=freshRow(id,String(v.id),v.name||'',ids);r.topologyChanged=true;r.openingFood=ids.reduce((n,id)=>n+D3.stockRaw(w,id,'food'),0);r.openingNatural=ids.reduce((n,id)=>n+num(w.map.get(id)?.resources?.food),0);s.live.groups[id]=r;}
 if(!eq(r.nationId,v.id)||r.tileIds.length!==ids.length||r.tileIds.some((id,i)=>id!==ids[i]))r.topologyChanged=true;
 if(occupationLedger)r.occupationLedgerAttributions=(r.occupationLedgerAttributions||0)+1;
 return r;}
function row(w,v,tid){return rowWithMembership(w,v,tid,D3.members(v,tid));}
function add(w,v,tid,k,amount){if(!w||!v||!Number.isFinite(amount)||!amount)return;const r=row(w,v,tid);r[k]=(r[k]||0)+amount;const s=state(w);if(Object.hasOwn(s.total,k))s.total[k]+=amount;}
// Accounting is identical to sequential add(), but many metrics from one real
// stock transaction share one settled membership lookup and one window row.
function addMany(w,v,tid,pairs,membership){if(!w||!v)return;let r=null,s=null;for(const [k,value] of pairs){if(!Number.isFinite(value)||!value)continue;if(!r){r=membership!==undefined?rowWithMembership(w,v,tid,membership):row(w,v,tid);s=state(w);}r[k]=(r[k]||0)+value;if(Object.hasOwn(s.total,k))s.total[k]+=value;}}
function fillLabor(w,r,now){const v=w.villages.find(v=>eq(v.id,r.nationId));if(!v)return;const ids=new Set(now.tileIds.map(Number)),people=(v.residents||[]).filter(p=>p.alive!==false&&ids.has(Number(p.homeTileId)));r.population=people.length;r.foodLaborers=people.filter(p=>p.age>=15&&['농부','채집꾼','사냥꾼'].includes(p.job)&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'&&!p.militaryActive32B).length;r.severeHunger=people.filter(p=>num(p.hunger)>=85).length;r.criticalHunger=people.filter(p=>num(p.hunger)>=95).length;const demand=people.reduce((n,p)=>n+(num(p.age)<15?.30:.42),0);r.foodReserveCycles=demand?r.closingFood/demand:999;}
function finish(w,s){const live=s.live;if(!live)return;const physical=groupedPhysical(w);for(const r of Object.values(live.groups)){
 const now=physical.get(r.settlementId);if(now&&eq(now.nationId,r.nationId)){r.closingFood=now.closingFood;r.closingNatural=now.closingNatural;r.closingCapacity=now.closingCapacity;
 if(r.tileIds.join(',')!==now.tileIds.join(','))r.topologyChanged=true;
 const v=w.villages.find(v=>eq(v.id,r.nationId));if(v)fillLabor(w,r,now);
 
 }else{r.closingFood=null;r.closingNatural=null;r.closingCapacity=null;r.topologyChanged=true;}
 r.storageDelta=r.closingFood==null?null:r.closingFood-r.openingFood;
 r.observedFoodDelta=r.harvestStored+r.otherDeposited-r.mealReceived-r.otherWithdrawn-r.foodSpoiled-r.frontierFoodSpent;
 r.unattributedDelta=r.storageDelta==null||r.topologyChanged?null:r.storageDelta-r.observedFoodDelta;
 }s.windows.push({startOrdinal:live.startOrdinal,endOrdinal:Math.min(live.endOrdinal,calendar(w)-1||live.endOrdinal),startedAtOrdinal:live.startedAtOrdinal,partialStart:live.partialStart,rows:Object.values(live.groups)});if(s.windows.length>360)s.windows.splice(0,s.windows.length-360);s.periods++;s.live=null;}
function roll(w){const s=state(w),current=Math.floor((calendar(w)-1)/30);if(s.live&&current!==s.lastBucket){finish(w,s);start(w);}}
// Conservation: take actual natural raw material, multiply by the original production
// multiplier, deposit the output, then restore *only* unused input to nature. This
// preserves the previously used multiplier and never creates a substitute output.
function harvestAndStore(p,v,w,t,k,requested,day){const raw=Math.max(0,num(t.harvest(k,requested,day))),baseMul=Math.max(0,num(v.harvestMultiplier(k,t))),mul=Math.max(0,num(NS.V034G5?.workerMultiplier?.(p,v,k,t,baseMul)??baseMul)),made=raw*mul;const prev=harvestScope.get(w);harvestScope.set(w,{v,t,k});let stored=0;
 try{if(made>0)stored=Math.max(0,num(v.depositAt(t.id,k,made)));}finally{if(prev)harvestScope.set(w,prev);else harvestScope.delete(w);}
 const refused=Math.max(0,made-stored),restored=made>EPS?Math.min(raw,raw*(refused/made)):raw;
 if(restored>0){t.resources[k]=Math.max(0,num(t.resources?.[k])+restored);}
 if(k==='food'){
  addMany(w,v,t.id,[['harvestRequested',Math.max(0,num(requested))],['harvestRaw',raw],['harvestProduced',made],['harvestStored',stored],['harvestRestoredNatural',restored],['harvestRejectedOutput',refused],['harvestCalls',1]]);
 }
 return stored;
}
// Observe D3's actual physical transfer while retaining all its own distribution logic.
// D3B3B records transactions inside the original D3 physical settlement
// operation. Its already-resolved membership and opening local inventory are
// passed here, so no second topology lookup/stock-capacity scan is necessary.
const origMeta=NS.Person.prototype.metabolism;
function observeWithdrawFast(w,v,tid,k,qty,got,m,local){if(!w)return;
 const pairs=[],fed=mealScope.get(w);if(k==='food'&&fed?.v===v)pairs.push(['mealRequested',Math.max(0,num(qty))]);
 if(got>0){
  if(m?.ids.length>1){const remote=Math.max(0,got-Math.min(Math.max(0,num(qty)),local));
   if(remote>EPS){const key=({food:'remoteFoodWithdrawn',wood:'remoteWoodWithdrawn',stone:'remoteStoneWithdrawn'})[k];if(key)pairs.push([key,remote]);pairs.push(['remoteWithdrawCalls',1]);}}
  if(k==='food')pairs.push([fed?.v===v?'mealReceived':'otherWithdrawn',got]);
 }
 if(pairs.length)addMany(w,v,tid,pairs,m);
}
function observeDepositFast(w,v,tid,k,qty,got,m,localRoom){if(!w)return;
 const pairs=[];
 if(m?.ids.length>1){const remote=Math.max(0,got-Math.min(got,localRoom));if(remote>EPS){if(k==='food')pairs.push(['remoteFoodDeposited',remote]);pairs.push(['remoteDepositCalls',1]);}}
 if(k==='food'){
  const req=Math.max(0,num(qty));if(req>0){pairs.push(['depositRequested',req],['depositAccepted',got],['depositRejected',Math.max(0,req-got)]);
   if(harvestScope.get(w)?.v!==v)pairs.push(['otherDeposited',got]);
  }
 }
 if(pairs.length)addMany(w,v,tid,pairs,m);
}
NS.Person.prototype.metabolism=function(v,w,...args){const prior=mealScope.get(w);mealScope.set(w,{v});try{return origMeta.call(this,v,w,...args);}finally{if(prior)mealScope.set(w,prior);else mealScope.delete(w);}};
const origSync=NS.Tile.prototype.syncResources;
NS.Tile.prototype.syncResources=function(day){const before=num(this.resources?.food),out=origSync.call(this,day),gained=Math.max(0,num(this.resources?.food)-before),w=NS._v32fActiveAct?.w||this._worldRef;if(gained>EPS&&w){const v=(w.villages||[]).find(v=>eq(v.id,this.ownerId));if(v)add(w,v,this.id,'foodRegenObserved',gained);}return out;};
// Explicit transaction lifecycle: these call sites return any refused goods to the
// original physical source through the normal D3 deposit function. Never assume
// returns are full if a same-day unrelated action filled the origin store.
function transferWithReturn(v,from,to,k,amount){const w=v._world,previous=transferScope.get(w);transferScope.set(w,{v,kind:'TRANSFER'});let took=0,put=0,returned=0;
 try{took=v.withdrawAt(from,k,amount);put=v.depositAt(to,k,took);if(took>put+EPS){transferScope.set(w,{v,kind:'RETURN'});returned=v.depositAt(from,k,took-put);}}finally{if(previous)transferScope.set(w,previous);else transferScope.delete(w);}
 if(k==='food'){add(w,v,to,'transferMoved',took);add(w,v,to,'transferAccepted',put);add(w,v,from,'transferReturned',returned);if(took-put-returned>EPS)add(w,v,from,'transferUnrecovered',took-put-returned);}
 return {took,put,returned,unrecovered:Math.max(0,took-put-returned)};
}
const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){start(this);const result=prevAdvance.apply(this,args);roll(this);return result;};
// A separate read-only slot scan runs only when exporting a report (not in Person.act).
function laborIssues(w){const issues=[];for(const v of w.villages||[])for(const p of v.residents||[]){if(!NS.V034D1A.eligible(p)||!p._v29SlotKey)continue;const s=NS.V034D1A.slotInfo(w,p);if(s.valid)continue;const tid=Number(p.workTileId),t=w.map.get(tid),idx=Number(p.workBuildingIndex29);issues.push({personId:String(p.id),nationId:String(v.id),homeTileId:p.homeTileId,workTileId:p.workTileId,job:p.job,slotKey:p._v29SlotKey,category:s.kind,buildingIndex:Number.isInteger(idx)?idx:null,buildingType:t?.buildings?.[idx]??p.workBuildingType29??null,buildingCondition:t?.buildingCondition?.[idx]??null});}return issues;}
function windowRows(w,partial=true){const s=state(w),out=s.windows.flatMap(win=>win.rows.map(r=>({...r,windowStart:win.startOrdinal,windowEnd:win.endOrdinal,partial:win.partialStart?'STARTED_MID_WINDOW':''})));if(partial&&s.live){const now=groupedPhysical(w);for(const r of Object.values(s.live.groups)){const x={...r},n=now.get(r.settlementId);x.closingFood=n?.closingFood??null;x.closingNatural=n?.closingNatural??null;x.closingCapacity=n?.closingCapacity??null;if(n)fillLabor(w,x,n);x.storageDelta=x.closingFood==null?null:x.closingFood-x.openingFood;x.observedFoodDelta=x.harvestStored+x.otherDeposited-x.mealReceived-x.otherWithdrawn-x.foodSpoiled-x.frontierFoodSpent;x.topologyChanged=x.topologyChanged||!!n&&(x.tileIds.join(',')!==n.tileIds.join(','));x.unattributedDelta=x.storageDelta==null||x.topologyChanged?null:x.storageDelta-x.observedFoodDelta;out.push({...x,windowStart:s.live.startOrdinal,windowEnd:Math.max(s.live.startedAtOrdinal,calendar(w)),partial:'ACTIVE'});}}return out;}
const COL=['windowStart','windowEnd','partial','settlementId','nationId','nationName','tileIds','openingFood','closingFood','storageDelta','harvestRequested','harvestRaw','harvestProduced','harvestStored','harvestRestoredNatural','harvestRejectedOutput','depositRequested','depositAccepted','depositRejected','mealRequested','mealReceived','otherDeposited','otherWithdrawn','foodSpoiled','frontierFoodSpent','transferMoved','transferAccepted','transferReturned','transferUnrecovered','remoteFoodWithdrawn','remoteWoodWithdrawn','remoteStoneWithdrawn','remoteFoodDeposited','foodRegenObserved','openingNatural','closingNatural','openingCapacity','closingCapacity','population','foodLaborers','severeHunger','criticalHunger','foodReserveCycles','observedFoodDelta','unattributedDelta','topologyChanged'];
const csvEsc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
function foodCSV(w){const rows=windowRows(w);return [COL.join(','),...rows.map(r=>COL.map(k=>csvEsc(k==='tileIds'?r.tileIds.join('|'):r[k])).join(','))].join('\n');}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this),s=state(this);out.version=VERSION;out.v034d3a={revision:'conserved-harvest-30day-food-flow',startedOrdinal:s.startedOrdinal,windows:s.windows,live:s.live,total:s.total,periods:s.periods,lastBucket:s.lastBucket};return out;};
NS.World.from=function(data){if(data?.version!==VERSION)throw Error(VERSION+' 저장 파일만 지원합니다.');const w=oldFrom({...data,version:PREVIOUS}),d=data.v034d3a;if(d&&Array.isArray(d.windows)){const s=state(w);s.startedOrdinal=num(d.startedOrdinal);s.windows=d.windows.slice(-360);s.live=d.live||null;s.total=d.total||s.total;s.periods=num(d.periods);s.lastBucket=d.lastBucket??null;}return w;};
function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const d=localStorage.getItem(KEY);return d?NS.World.from(JSON.parse(d)):null;},
 export(w){download(`village-observer-v034D3A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3A-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3A-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D3.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3A-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+foodCSV(w));}
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w),s=state(w);if(d.worldSummary){d.worldSummary.v034d3aRevision='conserved-civilian-harvest-food-flow-v1';d.worldSummary.v034d3aFoodFlow={startedOrdinal:s.startedOrdinal,periods:s.periods,total:{...s.total},latestPeriods:s.windows.slice(-2),liveStart:s.live?.startOrdinal??null,laborIssues:laborIssues(w)};}d.version=VERSION;return d;};
if(NS.UI){const head=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const ret=head.apply(this,args);if(typeof document==='undefined')return ret;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const near=document.getElementById('exportSettlementEconomyD3Btn');if(near&&!document.getElementById('exportSettlementFoodFlowD3ABtn')){const btn=document.createElement('button');btn.id='exportSettlementFoodFlowD3ABtn';btn.textContent='Food Flow 30일 CSV';btn.title='D3A 30일 단위 식량 흐름·입고/반환·공유 실제량 ('+COL.length+'열)';btn.addEventListener('click',()=>{try{NS.SaveSystem.exportSettlementFoodFlowCSV(this.world);}catch(e){console.error(e);alert(e.message);}});near.insertAdjacentElement('afterend',btn);}return ret;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Food Supply & Storage Stabilization',summary:'일반 식량·목재·석재 채집물의 미입고 원료를 자연으로 정확히 복구하고, 30일 식량 수지와 실제 Settlement 간격 내 원격 조달·반송을 관측합니다. 생산·소비·자연회복 밸런스는 유지합니다.',sections:[['수확 보존',['창고가 가득 차도 채집 시 사용한 원료 중 입고되지 않은 생산물에 대응하는 양을 자연 자원으로 복원합니다.','실제 생산 효율, 주민 소비, 지형별 자원 회복률은 변경하지 않습니다.']],['관측',['새 Food Flow 30일 CSV에서 Settlement별 주식량 입고·소비·복원·타일 간 원격 조달을 관측합니다.','이전 D3 foodDepositOverflow는 입고 미수용 요청량이며 실제 유실량이 아닙니다.']],['검증',['기존 Snapshot 1,683열, Settlement 48열, Housing 11열, Economy 24열을 유지합니다.','다른 Settlement 재고·시장 Gold·군사 물류는 변경하지 않습니다.']]]});
NS.V034D3A=Object.freeze({version:VERSION,observeWithdrawFast,observeDepositFast,addMetric:add,harvestAndStore,transferWithReturn,isReturning:(w,v)=>{const scope=transferScope.get(w);return !!(scope&&scope.v===v&&scope.kind==='RETURN');},foodCSV,columns:COL,stats:state,rows:windowRows,ensureRow:row,laborIssues,audit:w=>({ok:D3.audit(w).ok,conservedHarvestRestored:state(w).total.harvestRestoredNatural,transferUnrecovered:state(w).total.transferUnrecovered})});
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D3A header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034d3a1.js */
/* Village Observer V0.34D3A1 — real calendar month + audited direct food sinks. */
(function(NS){'use strict';
const VERSION='V0.34D3A1',PREVIOUS='V0.34D3A',KEY='village-observer-v034d3a1';
const H=NS.V034D3A,D=NS.V034D3,num=x=>Number.isFinite(Number(x))?Number(x):0;
const stats=new WeakMap();
function note(w,k,x){let z=stats.get(w);if(!z){z={spoilageCalls:0,frontierStarts:0,frontierPhysicalSpent:0,spoilagePhysicalSpent:0,convertedD3ASave:false};stats.set(w,z);}z[k]=(z[k]||0)+x;return z;}
function spoilage(w,v,id,amount){if(amount>0){H.stats(w);/* Incur a direct physical sink at its owning tile, without withdrawals. */
  H.addMetric(w,v,id,'foodSpoiled',amount);note(w,'spoilageCalls',1);note(w,'spoilagePhysicalSpent',amount);}}
function frontierBefore(v,w){return [...v.territory].map(id=>({id,stock:D.stockRaw(w,id,'food')}));}
function frontierAfter(v,w,before){let total=0;for(const r of before||[]){const after=D.stockRaw(w,r.id,'food'),spent=r.stock-after;if(spent>1e-7){H.addMetric(w,v,r.id,'frontierFoodSpent',spent);total+=spent;}}
  if(total>1e-7){note(w,'frontierStarts',1);note(w,'frontierPhysicalSpent',total);}return total;}
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;d.v034d3a1={revision:'calendar-food-audit-v1',directSinkStats:stats.get(this)||{},periodCalendarDays:30,originalD3AWindowsMigrated:false};return d;};
NS.World.from=function(data){if(data?.version!==VERSION&&data?.version!==PREVIOUS)throw Error(VERSION+' 또는 V0.34D3A 저장 파일만 지원합니다.');const fromPrevious=data.version===PREVIOUS;const w=prevFrom({...data,version:PREVIOUS});const s=H.stats(w);if(fromPrevious){/* 90-calendar-day legacy observations cannot be losslessly split into 30-day periods. */s.windows=[];s.live=null;s.lastBucket=null;s.startedOrdinal=num(w.calendarOrdinalDay());s.periods=0;note(w,'convertedD3ASave',1);}else{stats.set(w,data.v034d3a1?.directSinkStats||{});}return w;};
function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const d=localStorage.getItem(KEY);return d?NS.World.from(JSON.parse(d)):null;},
 export(w){download(`village-observer-v034D3A1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3A1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3A1-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3A1-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3A1-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3A1-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3A1-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+H.foodCSV(w));}};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d3a1Revision='actual-calendar-30day-food-sinks-and-topology-audit';d.worldSummary.v034d3a1Audit={...(stats.get(w)||{}),periodCalendarDays:30,foodFlowColumns:H.columns.length,uniqueFoodFlowColumns:new Set(H.columns).size,d3Audit:D.audit(w).ok,d2aAudit:NS.V034D2A.audit(w).ok};}return d;};
if(NS.UI){const oldHead=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const out=oldHead.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementFoodFlowD3ABtn');if(btn){btn.textContent='Food Flow 30일 CSV';btn.title='D3A1 실제 달력 30일 식량 수지 · 직접 부패/개척 비용 · '+H.columns.length+'개 고유 열';}}return out;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Food Flow Calendar & Audit Hotfix',summary:'식량 수지를 실제 30달력일 단위로 집계하고, 중복 CSV 열을 제거하며 부패와 개척 식량 비용을 실제 물리 차감 기준으로 기록합니다. Settlement 구성 변경은 미설명 손실로 오판하지 않습니다.',sections:[['달력·CSV',['기존 30 경제주기(약 90달력일) 집계를 실제 30달력일로 수정했습니다.','중복된 harvestRequested CSV 열을 제거하고 부패 및 개척 식량비 열을 추가했습니다.']],['직접 식량 차감',['창고 식량 부패는 물리 타일별 실제 감소량을 별도 집계합니다.','개척 비용은 실제 식량 재고 차감을 비용 타일에 계측합니다.','Settlement 합병·분할이 포함된 관측 창의 미설명 수지는 판정 보류로 표시합니다.']],['밸런스 유지',['자연회복·농업 효율·식량 소비·부패율·개척 비용 수치는 변경하지 않습니다.']]]});
NS.V034D3A1=Object.freeze({version:VERSION,spoilage,frontierBefore,frontierAfter,stats:w=>stats.get(w)||{},audit:w=>({ok:D.audit(w).ok&&NS.V034D2A.audit(w).ok,calendar30:true,uniqueColumns:new Set(H.columns).size===H.columns.length})});
})(window.VSim);

;
/* H1B2 bundled source: v034d3a2.js */
/* Village Observer V0.34D3A2 — physical frontier food upkeep and supply-accident audit.
 * Only observation changes: no material, Gold, AI, or RNG mutations.
 */
(function(NS){'use strict';
const VERSION='V0.34D3A2',PREVIOUS='V0.34D3A1',KEY='village-observer-v034d3a2';
const H=NS.V034D3A,D=NS.V034D3;
const keys=['frontierFoodUpkeep','frontierFoodAccident'];
const map=new WeakMap();
const n=x=>Number.isFinite(Number(x))?Number(x):0;
function stats(w){let s=map.get(w);if(!s){s={upkeepEvents:0,accidentEvents:0,upkeepPhysicalSpent:0,accidentPhysicalSpent:0,upkeepRequested:0,accidentRequested:0,otherSaveMigrated:false};map.set(w,s);}return s;}
function ensure(w){const s=H.stats(w);s.total=s.total||{};for(const k of [...keys,'frontierFoodSpent'])if(!Number.isFinite(s.total[k]))s.total[k]=0;return s;}
function frontierBefore(v,w,sourceTileId){
 if(!v||!w)return null;
 ensure(w);
 // Open the calendar bucket BEFORE the physical mutation, even for an otherwise idle tile.
 const target=Number.isFinite(Number(sourceTileId))?Number(sourceTileId):Number(v.coreTileId);
 if(w.map.get(target))H.ensureRow(w,v,target);
 return [...v.territory].map(id=>({id:Number(id),stock:D.stockRaw(w,id,'food')}));
}
function frontierAfter(v,w,before,kind,requested,projectId){
 if(!Array.isArray(before)||!w||!v)return 0;
 const m=kind==='accident'?'frontierFoodAccident':'frontierFoodUpkeep';
 const x=stats(w),t=Math.max(0,n(requested));
 x[kind==='accident'?'accidentEvents':'upkeepEvents']++;
 x[kind==='accident'?'accidentRequested':'upkeepRequested']+=t;
 let total=0;
 // Record real tile withdrawals, never charge a forecast as though it was spent.
 for(const it of before){const used=it.stock-D.stockRaw(w,it.id,'food');if(used>1e-8){
  H.addMetric(w,v,it.id,m,used);
  // Preserve the legacy D3A1 observed-food equation: charge this sink once.
  H.addMetric(w,v,it.id,'frontierFoodSpent',used);
  total+=used;
 }}
 x[kind==='accident'?'accidentPhysicalSpent':'upkeepPhysicalSpent']+=total;
 return total;
}
function columns(){return [...H.columns.slice(0,H.columns.indexOf('frontierFoodSpent')+1),...keys,...H.columns.slice(H.columns.indexOf('frontierFoodSpent')+1)];}
const cols=columns();
function rows(w){ensure(w);return H.rows(w).map(r=>({...r,frontierFoodUpkeep:n(r.frontierFoodUpkeep),frontierFoodAccident:n(r.frontierFoodAccident)}));}
const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
function foodCSV(w){return [cols.join(','),...rows(w).map(r=>cols.map(k=>esc(k==='tileIds'?r.tileIds.join('|'):r[k])).join(','))].join('\n');}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this);out.version=VERSION;out.v034d3a2={revision:'frontier-food-physical-upkeep-accident-v1',stats:stats(this),columns:cols.length};return out;};
NS.World.from=function(data){if(data?.version!==VERSION&&data?.version!==PREVIOUS&&data?.version!=='V0.34D3A')throw Error(VERSION+' 또는 D3A1/D3A 저장 파일만 지원합니다.');
 const migrated=data.version!==VERSION;
 const w=oldFrom({...data,version:data.version==='V0.34D3A'?'V0.34D3A':PREVIOUS});
 map.set(w,migrated?{...stats(w),otherSaveMigrated:true}:(data.v034d3a2?.stats||stats(w)));
 ensure(w);return w;};
function download(name,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const txt=localStorage.getItem(KEY);return txt?NS.World.from(JSON.parse(txt)):null;},
 export(w){download(`village-observer-v034D3A2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3A2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3A2-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3A2-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3A2-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3A2-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3A2-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+foodCSV(w));}
};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJSON.call(this,w);d.version=VERSION;const f=d.worldSummary?.v034d3aFoodFlow;if(f){f.total={...f.total,frontierFoodUpkeep:n(ensure(w).total.frontierFoodUpkeep),frontierFoodAccident:n(ensure(w).total.frontierFoodAccident)};
  f.latestPeriods=(f.latestPeriods||[]).map(win=>({...win,rows:win.rows.map(r=>({...r,frontierFoodUpkeep:n(r.frontierFoodUpkeep),frontierFoodAccident:n(r.frontierFoodAccident)}))}));}
 if(d.worldSummary){d.worldSummary.v034d3a2Revision='physical-frontier-food-sink-audit';d.worldSummary.v034d3a2Audit={...stats(w),foodFlowColumns:cols.length,uniqueFoodFlowColumns:new Set(cols).size,frontierFoodSpentTotal:n(ensure(w).total.frontierFoodSpent),frontierFoodUpkeep:n(ensure(w).total.frontierFoodUpkeep),frontierFoodAccident:n(ensure(w).total.frontierFoodAccident),previousFrontierStartCost:n(NS.V034D3A1.stats(w).frontierPhysicalSpent),stockAudit:D.audit(w).ok};}
 return d;};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const o=oldHeader.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const btn=document.getElementById('exportSettlementFoodFlowD3ABtn');if(btn){btn.textContent='Food Flow 30일 CSV';btn.title='D3A2 개척 유지·사고 식량 회계 포함 · '+cols.length+'개 고유 열';}}return o;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-11',title:'Frontier Food Accounting Hotfix',summary:'개척 진행 중 식량 유지비와 보급 사고의 실제 재고 감소량을 30달력일 Food Flow 수지에 포함합니다. 개척 정책·식량 밸런스는 변경하지 않습니다.',sections:[['식량 수지',['V0.20 개척 유지비의 실제 물리 재고 감소량을 추적합니다.','V0.20 보급 사고의 추가 식량 소모를 별도로 기록합니다.','기존 개척 착공 비용·부패 비용과 중복 합산하지 않습니다.']],['호환성·검증',['Food Flow CSV 48개 고유 열. 기존 4개 CSV는 변경하지 않습니다.','기존 D3A1/D3A 저장은 수동 JSON 불러오기 경로로 지원합니다.','식량 생산·소비·개척 사고 확률과 난수 사용은 변경하지 않습니다.']]]});
NS.V034D3A2=Object.freeze({version:VERSION,frontierBefore,frontierAfter,foodCSV,columns:cols,rows,stats,audit:w=>({ok:D.audit(w).ok,upkeep:n(ensure(w).total.frontierFoodUpkeep),accidents:n(ensure(w).total.frontierFoodAccident),columns:cols.length,unique:new Set(cols).size})});
})(window.VSim);

;
/* H1B2 bundled source: v034d3b.js */
/* Village Observer V0.34D3B — Early Economic Balance & War-Scale Recovery Policy V1.
 * Adds no resources during ordinary simulation. One-time founding wood is a physical
 * opening endowment for NEW worlds only. Original 169 legacy blocks are untouched.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B', PREVIOUS='V0.34D3A2', KEY='village-observer-v034d3b';
const WOOD_REGEN=Object.freeze({plain:.016,grass:.036,forest:.280,rock:.008,mountain:.015,water:0});
const BASE_COSTS=Object.freeze({house:15,farmstead:10,quarry:14,expansion:24});
const FRONTIER_WOOD=Object.freeze({twoPioneers:14,threePioneers:16});
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const now=w=>n(w?.calendarOrdinalDay?.()??(w?.ordinalDay?.()*3));
function state(v){return v._v34d3b||(v._v34d3b={starterChecked:false,starterWood:0,woodWorkerMoves:0,lastWoodLaborCal:-100000,decisions:0});}
function warsFor(v,w){return (w?.v33War?.wars||[]).filter(war=>{
 const ids=Array.isArray(war.participantIds)&&war.participantIds.length?war.participantIds:[war.attackerId,war.defenderId,...(war.sideAIds||[]),...(war.sideBIds||[])];
 return ids.some(id=>n(id)===n(v.id));
});}
function warDamage(v,w){
 const wars=warsFor(v,w),cal=now(w),pop=Math.max(1,n(v.population?.())),territory=Math.max(1,v.territory?.size||1);
 let casualties=0,wounded=0,active=false,recent=false,referencePop=pop;
 for(const war of wars){const end=n(war.endCal||cal),isActive=war.status==='ACTIVE';if(!isActive&&(cal-end>1080||end>cal))continue;
  recent=true;active=active||isActive;
  casualties+=n(war.casualties?.[v.id]);wounded+=n(war.wounded?.[v.id]);
  referencePop=Math.max(referencePop,n(war.startPopulation?.[v.id]));
 }
 let occupied=0,coreOccupied=false;
 for(const id of v.territory||[]){const t=w?.map?.get?.(id);if(t?.v33OccupierId!=null&&n(t.v33OccupierId)!==n(v.id)){occupied++;if(n(id)===n(v.coreTileId))coreOccupied=true;}}
 const lossShare=(casualties+wounded*.4)/Math.max(1,referencePop),occupiedShare=occupied/territory;
 return{active,recent,casualties,wounded,referencePop,lossShare,occupied,occupiedShare,coreOccupied};
}
// RECOVERY represents genuine war destruction, not two ordinary market shortages.
// A non-war catastrophic famine is handled by the separate emergency survival mode.
function recoveryShouldEnter(v,w,p){
 if(v?.status!=='active')return false;
 const damage=warDamage(v,w);
 if(!damage.recent&&!damage.coreOccupied&&!damage.occupied)return false;
 const food=n(p.food),health=n(p.health),inactive=n(p.inactiveShare),housing=n(p.cap)<n(p.pop)*.70;
 const collapse=food<18||health<48||inactive>=.30||housing;
 const majorLoss=damage.lossShare>=.15&&damage.casualties>=2;
 const majorOccupation=damage.coreOccupied||damage.occupiedShare>=.28;
 return (majorLoss&&collapse)||(majorOccupation&&(collapse||damage.occupiedShare>=.50))||
   (damage.active&&damage.lossShare>=.22&&food<25)||(damage.active&&inactive>=.65&&food<22);
}
function recoveryStable(v,w,p){
 const d=warDamage(v,w);
 // Do not instantly "recover" while the state is being devastated by occupation.
 if(d.active&&(d.coreOccupied||d.occupiedShare>=.28))return false;
 return n(p.food)>=24&&n(p.health)>=50&&n(p.inactiveShare)<.35&&
  n(p.cap)>=n(p.pop)*.78 && n(p.wood)>=Math.max(6,n(p.pop)*.10);
}
// The old B2 rule entered national Survival from small population/risk alone.
// Keep national emergency for *actual* starvation or catastrophic war collapse;
// local hunger mitigation, shipments and ordinary economic decisions remain active.
function survivalEmergency(v,w,p){
 const pop=Math.max(1,n(p.pop)),hunger=n(p.hunger),food=n(p.food),severe=n(p.severeHunger85),critical=n(p.severeHunger95),starv=n(p.starv),war=warDamage(v,w);
 const starvation= (starv>=2&&(food<22||hunger>=25))||
   (critical>=Math.max(2,Math.ceil(pop*.055))&&food<18)||
   (severe>=Math.max(3,Math.ceil(pop*.12))&&food<12)||
   (food<6&&hunger>=35)||(pop<=6&&food<12&&hunger>=30);
 const warCollapse=war.recent&&war.lossShare>=.23&&food<14&&hunger>=27;
 return !!(starvation||warCollapse);
}
function survivalStable(v,w,p,oldStable){
 if(oldStable)return true;
 return n(p.food)>=24&&n(p.hunger)<24&&n(p.health)>=62&&n(p.severeHunger95)===0&&
 n(p.severeHunger85)<=Math.max(1,Math.floor(n(p.pop)*.02))&&n(p.starv)===0&&n(p.pop)>=7;
}
// One-time founding grant is put into *real tile storage*. Imported worlds do not
// receive it; returned quantity is the actual accepted quantity, never a promise.
function foundingWood(v,w){
 const s=state(v);if(s.starterChecked)return 0;
 s.starterChecked=true;
 if(w.year!==1||n(w.ordinalDay?.())>3||v.status!=='active')return 0;
 let left=12,put=0;
 for(const id of [v.coreTileId,...(v.territory||[])]){
  if(left<=0)break;const q=Math.max(0,n(v.depositAt?.(id,'wood',left)));put+=q;left-=q;
 }
 s.starterWood=put;return put;
}
function woodLaborPulse(v,w){
 const s=state(v),cal=now(w);if(v.status!=='active'||cal-s.lastWoodLaborCal<90)return 0;
 s.lastWoodLaborCal=cal;s.decisions++;
 if(v.recoveryState?.active||v.v30b2?.survival?.active||warDamage(v,w).active)return 0;
 const pop=n(v.population?.()),reserve=Math.max(1,n(v.targetWood?.(w)));
 if(pop<12||n(v.wood)>=Math.min(28,reserve*.60))return 0;
 const existing=(v.residents||[]).filter(x=>x.alive&&x.age>=16&&x.job==='목수'&&x.assignment!=='PIONEER').length;
 const goal=Math.min(3,Math.max(1,Math.ceil(pop/30)));
 if(existing>=goal)return 0;
 // Actual civilians are reassigned, never created. Prefer unemployed adults; only
 // release surplus non-food occupations if the normal unemployed pool is empty.
 const counts={};for(const p of v.residents||[])if(p.alive)counts[p.job]=(counts[p.job]||0)+1;
 const foodDays=n(v.foodReserveDays?.());
 const eligible=p=>{
  if(!p.alive||p.age<16||p.age>62||p.assignment||p.militaryStatus32A==='active')return false;
  if(p.job==='무직')return true;
  if(p.job==='경비')return (counts['경비']||0)>Math.max(1,Math.ceil(pop/30));
  if(p.job==='상인')return (counts['상인']||0)>1;
  if(p.job==='건축가')return (counts['건축가']||0)>1&&!(v.constructionProjects||[]).length;
  if((p.job==='채집꾼'||p.job==='사냥꾼')&&foodDays>40)return (counts[p.job]||0)>1;
  return false;
 };
 const rank=p=>({'무직':0,'경비':1,'상인':2,'건축가':3,'채집꾼':4,'사냥꾼':5}[p.job]??9);
 const candidates=(v.residents||[]).filter(eligible).sort((a,b)=>rank(a)-rank(b)||n(b.skills?.building)-n(a.skills?.building)||String(a.id).localeCompare(String(b.id)));
 if(!candidates.length)return 0;
 let placed=0;
 const sites=[...(v.territory||[])].map(id=>w.map.get(id)).filter(t=>t&&NS.TERRAIN[t.terrain]?.passable)
  .sort((a,b)=>((b.terrain==='forest')-(a.terrain==='forest'))||n(b.resources?.wood)-n(a.resources?.wood));
 for(const person of candidates.slice(0,goal-existing)){
  const dest=sites.find(t=>n(w.map.distance?.(person.homeTileId,t.id))<=3)||w.map.get(person.homeTileId);
  if(!dest)continue;
  person.job='목수';person.workTileId=dest.id;person.workBuildingIndex29=null;person.workBuildingType29=null;
  person._v29NextJobReviewCal=cal+120;placed++;
 }
 if(placed){v._v29LaborForceDirty=true;s.woodWorkerMoves+=placed;}
 return placed;
}
// Late-bound economics. Legacy cost paths use the shared registry; no independent
// 0.8-era auto-build code is activated or retroactively re-priced.
for(const [k,val] of Object.entries(WOOD_REGEN)){
 if(NS.TERRAIN?.[k])NS.TERRAIN[k].regen.wood=val;
 if(NS.V010?.WOOD_REGEN)NS.V010.WOOD_REGEN[k]=val;
}
for(const [type,wood] of Object.entries(BASE_COSTS)){
 if(NS.V08?.BUILD_COSTS?.[type])NS.V08.BUILD_COSTS[type].wood=wood;
}
const oldHarvest=NS.Village.prototype.harvestMultiplier;
NS.Village.prototype.harvestMultiplier=function(kind,t){let multiplier=oldHarvest.call(this,kind,t);
 if(kind==='wood')multiplier*=n(this._world?.year)<=25?1.12:1.04;
 return multiplier;
};
const oldDaily=NS.Village.prototype.dailyTick;
NS.Village.prototype.dailyTick=function(w){foundingWood(this,w);return oldDaily.call(this,w);};
// Keep just enough *existing* timber for a real first frontier rather than
// spending the last 14 units on discretionary early infrastructure. Housing,
// food, quarry and sawmill remain exempt and still pay normal physical costs.
const oldConstruction=NS.Village.prototype.startConstruction;
if(oldConstruction)NS.Village.prototype.startConstruction=function(w,tileId,type,...rest){
 if(n(w?.year)<=12&&this.status==='active'&&!this.recoveryState?.active&&!(this.v30b2?.survival?.active)&&
    (this.territory?.size||0)<=2&&!['house','farmstead','ancient_farm','sawmill','quarry','row_house','collective_house'].includes(type)){
  const hasForest=[...(this.territory||[])].some(id=>w.map.get(id)?.terrain==='forest');
  if(!hasForest){const cost=NS.V08?.effectiveCost?.(this,type)||NS.V08?.BUILD_COSTS?.[type]||{};
   if(n(this.wood)>=14&&n(this.wood)-n(cost.wood)<14)return false;
  }
 }
 return oldConstruction.call(this,w,tileId,type,...rest);
};
const oldSeason=NS.Village.prototype.seasonalTick;
NS.Village.prototype.seasonalTick=function(w){woodLaborPulse(this,w);return oldSeason.call(this,w);};
const oldVSerialize=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(){const d=oldVSerialize.call(this);d.v34d3b={...state(this)};return d;};
const oldWSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldWSerialize.call(this);d.version=VERSION;d.v034d3b={policy:'war-scale-recovery-and-founding-economic-balance-v1'};return d;};
NS.World.from=function(d){if(!d||![VERSION,PREVIOUS,'V0.34D3A1','V0.34D3A'].includes(d.version))throw Error('V0.34D3B/D3A2/D3A1/D3A 저장 파일만 지원합니다.');
 const w=oldFrom({...d,version:d.version===VERSION?PREVIOUS:d.version});
 for(const v of w.villages||[]){const raw=(d.villages||[]).find(x=>n(x.id)===n(v.id))?.v34d3b;
  v._v34d3b=raw?{...state(v),...raw}:{...state(v),starterChecked:true};
 }
 return w;
};
function snapshotPolicy(w){return (w.villages||[]).map(v=>{
 const x=state(v),d=warDamage(v,w),sur=v.v30b2?.survival||{},rec=v.recoveryState||{};
 return{id:v.id,name:v.name,recovery:!!rec.active,survival:!!sur.active,warRecent:d.recent,warActive:d.active,warLossShare:+d.lossShare.toFixed(4),occupied:d.occupied,foundingWood:x.starterWood,woodLaborReassignments:x.woodWorkerMoves,
  wood:+n(v.wood).toFixed(2),foodDays:+n(v.foodReserveDays?.()).toFixed(2),pop:n(v.population?.())};
 });}
const oldSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const s=oldSnapshot.call(this,w,...args);if(s){const profile=snapshotPolicy(w);for(const row of s.villages||[]){const p=profile.find(x=>n(x.id)===n(row.id));if(p)Object.assign(row,{d3bWarScaleRecovery:p.recovery?1:0,d3bSurvivalEmergency:p.survival?1:0,d3bWarLossShare:p.warLossShare,d3bFoundingWood:p.foundingWood,d3bWoodLaborMoves:p.woodLaborReassignments});}if(s.global)Object.assign(s.global,{d3bRecoveryNations:profile.filter(x=>x.recovery).length,d3bEmergencyNations:profile.filter(x=>x.survival).length});}return s;};
const oldToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldToJSON.call(this,w);d.version=VERSION;
 if(d.worldSummary){d.worldSummary.v034d3bRevision='early-economic-balance-war-scale-recovery-v1';d.worldSummary.v034d3bBalance={woodRegen:WOOD_REGEN,baseConstructionWood:BASE_COSTS,activeFrontierWood:FRONTIER_WOOD,woodHarvestBoostEarly:1.12,woodHarvestBoostLate:1.04,firstFrontierTimberReserve:14,founderWoodBonus:12,foodConsumptionUnchanged:true,warAndRealStarvationOnly:true,nations:snapshotPolicy(w)};}
 return d;};
function download(name,body,mime='application/json'){const u=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const txt=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3a2');return txt?NS.World.from(JSON.parse(txt)):null;},
 export(w){download(`village-observer-v034D3B-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');}
};
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const r=oldHeader.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}return r;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Early Economic Balance & Recovery Policy V1',summary:'평시의 정상적인 경제성장을 위해 초기 목재 경제와 기초 건설비를 조정하고, 국가 차원의 복구·생존 체제는 중대한 전쟁 피해나 실제 기아 위기에서 발동합니다.',sections:[
 ['초반 경제',['목재 자연회복: 평야 0.016, 초지 0.036, 숲 0.280 / 3일 주기. 암지·산은 유지.','실제 채취 생산량: 목재 +12%(1~25년), 이후 +4%.','최초 건국 시 목재 12를 실제 저장고에 1회만 지급하며, 기존 저장 파일에는 지급하지 않습니다.','목재 부족 시 무직자 및 여유 비식량 노동자를 정규 벌목 노동자로 제한적으로 재배치하고, 초기 비필수 공사는 첫 개척 목재 최소 14를 남깁니다.']],
 ['기초 건설비',['주택 목재 18→15, 경작지 12→10, 채석장 16→14, 구형 일반 개척 단가 28→24, 실제 V20/V21 개척 2명 16→14·3명 18→16.','다른 자재·Gold·식량 비용, AI 개척 확률과 물리 건설 노동·개척민·보급·사고 비용은 유지.']],
 ['평시와 위기',['일시적 저재고·저인구·주거부족의 조합만으로 국가 Recovery·Survival을 발동하지 않습니다.','국가 Recovery는 실제 전쟁 피해와 주요 기반 악화가 동시에 있는 경우에 발동합니다.','전쟁이 없더라도 실제 심각한 기아·인구붕괴 시 생존모드 안전장치는 작동합니다.','지역 식량 물류·시세·일반 AI 경제 행동은 유지합니다.']],
 ['호환성·관측',['기존 169개 레거시 블록 보존, Github Pages/단일 HTML 동시 지원.','D3A2 저장 이식 및 D3A2 48열 Food Flow와 1683열 Snapshot V2 유지.','연간 snapshot/Devlog에 평시·전쟁위기 진단과 실제 목재 배치를 추가합니다.']]
]});
NS.V034D3B=Object.freeze({version:VERSION,woodRegen:WOOD_REGEN,constructionWood:BASE_COSTS,frontierWood:FRONTIER_WOOD,warDamage,recoveryShouldEnter,recoveryStable,survivalEmergency,survivalStable,foundingWood,woodLaborPulse,state,snapshotPolicy});
})(window.VSim);

;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('D3B_ECONOMIC_OBSERVATION',args[0],old,this,args):old.apply(this,args);};})(window.VSim);

;
/* H1B2 bundled source: v034d3b1.js */
/* V0.34D3B1 — Road-Connected Settlement Radius 2 / compact frontier preference.
   C1H protected code is transformed only at verified build anchors.
   No changes to road speed, military paths, physical stock flows or jobs. */
window.VSim=window.VSim||{};
(function(NS){'use strict';
const VERSION='V0.34D3B1',PREV='V0.34D3B',KEY='village-observer-v034d3b1';
const RADIUS=2,CAP=13,JOIN=1.24,SPLIT=1.40,PRIORITY=14;
const n=x=>Number(x||0),same=(a,b)=>String(a)===String(b);
const manhattan=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function isRoad(w,v,t){const i=t?.buildings?.indexOf('road')??-1;return i>=0&&n(t.buildingCondition?.[i]??100)>=25&&!!v?.hasTech?.('ROADS');}
function step(w,v,t,plannedRoad=false){const terrain=NS.TERRAIN?.[t?.terrain];if(!terrain?.passable)return Infinity;return n(terrain.tradeCost||1)*((plannedRoad||isRoad(w,v,t))?.62:1);}
function candidateExtension(v,w,c){
 if(NS.V034G3?.config?.spatialEnabled)return NS.V034G3.candidateExtension(v,w,c);
 // Potential road on a *neutral* target is only a score estimate; no road is
 // constructed for free. Actual C mergers still require physical roads.
 const t=c?.tile||w?.map?.get?.(n(c?.targetTileId??c?.tileId));
 if(!t||t.ownerId!=null||!v?.hasTech?.('ROADS')||!NS.V034C)return null;
 let best=null;
 for(const adj of w.map.neighbors4(t.id)){
  if(!same(adj.ownerId,v.id))continue;
  const r=NS.V034C.byTile(w,adj.id);if(!r||r.lifecycle!=='ACTIVE'||r.tileIds.length>=CAP)continue;
  const core=w.map.get(r.coreTileId);if(!core||manhattan(core,t)>RADIUS)continue;
  const allowed=new Set(r.tileIds);
  const outward=NS.V034C.path(w,core.id,adj.id,allowed,JOIN),returning=NS.V034C.path(w,adj.id,core.id,allowed,JOIN);
  const targetStep=step(w,v,t,true),backStep=step(w,v,adj);
  if(outward+targetStep>JOIN+1e-8||returning+backStep>JOIN+1e-8)continue;
  const row={settlementId:r.id,coreTileId:r.coreTileId,sourceTileId:adj.id,targetTileId:t.id,tilesAfter:r.tileIds.length+1,
   projectedOut:+(outward+targetStep).toFixed(3),projectedReturn:+(returning+backStep).toFixed(3)};
  if(!best||r.tileIds.length>best.tilesAfter-1||r.tileIds.length===best.tilesAfter-1&&String(r.id)<String(best.settlementId))best=row;
 }
 return best;
}
const previousPick=NS.V033F5A2?.selectAffordableCandidate;
if(previousPick)NS.V033F5A2.selectAffordableCandidate=function(v,w,rows,opts={}){
 // Only reorder plausible compact additions. Keep all fiscal/food/pioneer
 // feasibility and profile behavior in the inherited selector.
 let adjusted=null;
 for(const row of rows||[]){const ext=candidateExtension(v,w,row);if(!ext){if(adjusted)adjusted.push(row);continue;}
  if(!adjusted)adjusted=(rows||[]).slice(0,(rows||[]).indexOf(row));
  adjusted.push({...row,score:n(row.score)+PRIORITY,v034d3b1Extension:ext});
 }
 if(adjusted){adjusted.sort((a,b)=>n(b.score)-n(a.score));return previousPick.call(this,v,w,adjusted,opts);}
 return previousPick.call(this,v,w,rows,opts);
};
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;d.v034d3b1={revision:'road-radius-two-and-compact-frontier-v1',join:JOIN,split:SPLIT,maxTiles:CAP,range:RADIUS};return d;};
NS.World.from=function(d){if(d?.version===VERSION)return prevFrom({...d,version:PREV});return prevFrom(d);};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevToJSON.call(this,w);d.version=VERSION;Object.assign(d.worldSummary||{},
 {v034d3b1Revision:'road-connected-settlement-radius-two-and-compact-frontier',v034d3b1Policy:{maxTiles:CAP,coreManhattanRadius:RADIUS,joinCost:JOIN,splitCost:SPLIT,roadFactor:0.62,compactFrontierScoreBonus:PRIORITY,physicalRoadsRequired:true,landedFrontierRoadsNotFree:true}});return d;};
function download(name,text,mime='application/json'){const url=URL.createObjectURL(new Blob([text],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const txt=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b')||localStorage.getItem('village-observer-v034d3a2');return txt?NS.World.from(JSON.parse(txt)):null;},
 export(w){download(`village-observer-v034D3B1-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B1-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B1-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B1-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B1-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B1-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');}
};
if(NS.UI){const before=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=before.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}return r;};}
if(typeof document!=='undefined')document.title='Village Observer '+VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Road-Connected Settlement Radius 2',summary:'도로로 연결된 평지 기준으로 중심 정착지에서 최대 2칸·13타일까지 통합하고, 기존 Settlement와 연결할 수 있는 개척 후보에 제한적인 우선순위를 부여합니다.',sections:[
 ['도로 통합 범위',['병합 접근비 1.00→1.24, 분할 완충 1.15→1.40, 최대 구성 5→13타일.','중심에서 맨해튼 거리 2칸 이내만 통합할 수 있습니다. 중심 포함 1+4+8=13타일의 마름모가 최댓값입니다.','실제 물리 도로(ROADS 기술, 도로 상태 25 이상)를 통해 접근비 1.24 이하가 충족되어야 합니다. 도로 계수 0.62와 군사/교역 이동 규칙은 그대로입니다.']],
 ['개척 연속성',['기존 Settlement에 추가 가능한 인접 타일은 물리 도로 완공 이후 통합될 수 있으므로, 사전 개척 후보 평가에 최대 +14점만 부여합니다.','가상 도로·자원·노동·영토를 생성하지 않습니다. 실제 개척 인원, 비용, 식량 게이트 및 국가별 AIProfile 차이는 기존대로 유지합니다.']],
 ['검증·호환성',['기존 V0.34D3B 저장을 새로운 설정에서 불러오며 기존 영토·인구·자원을 유지합니다.','B1 저장은 Settlement 최대 13타일·중심 반경 2칸을 검증합니다. 이전 버전 세이브는 각 버전 기준을 사용합니다.','기존 식량·Gold 회계, 공동 물자·주거 모델은 변경하지 않습니다.']]
]});
NS.V034D3B1=Object.freeze({version:VERSION,policy:{CAP,RADIUS,JOIN,SPLIT,PRIORITY},candidateExtension});
})(window.VSim);

;
/* H1B2 bundled source: v034d3b2.js */
/* V0.34D3B2 — V24 physical food accounting + build release integrity.
 * Observation-only: no changes to food, Gold, RNG, labor, frontier eligibility.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B2',PREV='V0.34D3B1',KEY='village-observer-v034d3b2';
const D=NS.V034D3,H=NS.V034D3A,A1=NS.V034D3A1,A2=NS.V034D3A2;
const metric=new WeakMap(),eps=1e-7;
function stats(w){let r=metric.get(w);if(!r){r={regionalStarts:0,regionalRequested:0,regionalPhysicalSpent:0,regionalMismatchCount:0,regionalMismatchTotal:0,regionalByCost:{},migrationFromB1:false};metric.set(w,r);}return r;}
function frontierBefore(v,w,sourceId){
 if(!v||!w)return null;
 // Open the 30-calendar-day accounting bucket for *every* existing physical
 // stock owner before a nation-wide food setter may draw across tile stores.
 // A later H.addMetric should never take its opening snapshot after the sink.
 for(const id of v.territory)H.ensureRow(w,v,id);
 return A1.frontierBefore(v,w);
}
function frontierAfter(v,w,before,requested,projectId){
 if(!Array.isArray(before)||!v||!w)return 0;
 const paid=A1.frontierAfter(v,w,before),s=stats(w),wanted=Number(requested)||0;
 s.regionalStarts++;s.regionalRequested+=wanted;s.regionalPhysicalSpent+=paid;
 s.regionalByCost[String(wanted)]=(s.regionalByCost[String(wanted)]||0)+1;
 if(Math.abs(paid-wanted)>eps){s.regionalMismatchCount++;s.regionalMismatchTotal+=paid-wanted;}
 return paid;
}
// Read-only residual classification. These are *not* fictitious accounting
// corrections: unresolved rows remain unresolved in the original 48-column CSV.
function residualAudit(w){
 const totals={comparable:0,mismatched:0,residualSum:0,negativeExact10:0,negativeExact13:0,negativeMultiple10:0,negativeMultiple13:0,otherNegative:0,positive:0,maxAbs:0};
 for(const r of A2.rows(w)){
  if(r.topologyChanged||!Number.isFinite(Number(r.unattributedDelta)))continue;
  const d=Number(r.unattributedDelta);totals.comparable++;
  if(Math.abs(d)<=.01)continue;
  totals.mismatched++;totals.residualSum+=d;totals.maxAbs=Math.max(totals.maxAbs,Math.abs(d));
  if(d>0){totals.positive++;continue;}
  if(Math.abs(d+10)<.01)totals.negativeExact10++;
  else if(Math.abs(d+13)<.01)totals.negativeExact13++;
  else if(d< -10&&Math.abs(d/10-Math.round(d/10))<.001)totals.negativeMultiple10++;
  else if(d< -13&&Math.abs(d/13-Math.round(d/13))<.001)totals.negativeMultiple13++;
  else totals.otherNegative++;
 }
 totals.residualSum=+totals.residualSum.toFixed(6);totals.maxAbs=+totals.maxAbs.toFixed(6);
 return totals;
}
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;d.v034d3b2={revision:'regional-frontier-food-audit-and-release-identity-v1',stats:{...stats(this)}};return d;};
NS.World.from=function(data){
 // Delegate historical versions to B1's existing migration policy.
 const w=prevFrom(data?.version===VERSION?{...data,version:PREV}:data);
 metric.set(w,data.version===VERSION?{...stats(w),...(data.v034d3b2?.stats||{})}:{...stats(w),migrationFromB1:data.version===PREV});
 return w;
};
const priorJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=priorJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d3b2Revision='v24-regional-physical-food-audit-and-release-identity';d.worldSummary.v034d3b2Audit={...stats(w),foodFlowColumns:A2.columns.length,physicalStocksAudited:true,balancePolicyUnchanged:true,residuals:residualAudit(w),residualClassification:'observation-only; historical windows are not retroactively changed'};}return d;};
function download(name,data,type='application/json'){
 const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const x=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b1')||localStorage.getItem('village-observer-v034d3b');return x?NS.World.from(JSON.parse(x)):null;},
 export(w){download(`village-observer-v034D3B2-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B2-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B2-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B2-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B2-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+D.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B2-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+A2.foodCSV(w),'text/csv;charset=utf-8');}
};
function syncReleaseHeader(){
 if(typeof document==='undefined')return;
 document.title='Village Observer '+VERSION;
 const el=document.getElementById('versionBadge');if(el)el.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';
}
NS.RELEASE_VERSION=VERSION;
if(NS.UI){const prevHead=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const out=prevHead.apply(this,args);syncReleaseHeader();return out;};
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Food Flow Accounting & Release Integrity',summary:'V24 지역 개척 착공 시 실제로 소비된 식량을 기존 Food Flow 수지에 정확히 한 번 반영하고 좌상단 버전 표시를 V0.34D3B2로 바로잡습니다. 경제·전쟁·개척 밸런스는 그대로 유지됩니다.',sections:[
 ['V24 개척 착공 식량 회계',['2명/3명 지역 개척의 실제 식량 비용 10/13을 물리 타일별 사전·사후 재고 차이로 계측합니다.','기존 Food Flow 48열의 frontierFoodSpent를 이용하며 진행 유지비와 사고비는 다시 계상하지 않습니다.','개척 실패·결제 실패는 식량 차감을 발생시키지 않으므로 신규 착공 계측도 수행되지 않습니다.']],
 ['정확성·진단',['Devlog의 v034d3b2Audit에 지역 개척 착공 횟수·실제 지출량·요청량·불일치를 기록합니다.','기존 D3A2 저장에 남은 과거 누락은 소급하여 임의 수정하지 않습니다.','개척 비용과 무관한 잔차는 추가 원인 조사가 필요하며 자동으로 숨기거나 보정하지 않습니다.']],
 ['릴리스 버전 통일',['Hosted/Standalone의 초기 타이틀과 버전 배지를 빌드 버전으로 설정합니다.','최종 부트스트랩 로딩 직후, 새 세계 및 불러오기 렌더링에서 버전 배지를 재확인합니다.','버전 메타데이터·파일 이름·README·빌드 결과를 V0.34D3B2로 연결합니다.']]
]});
// D3A historically rendered during its own bootstrap, before B/B1 wrappers existed.
// Re-render the *final* wrapped header only after every bootstrap is installed.
try{window.villageObserver?.renderHeader?.();}catch(e){console.error('D3B2 initial release header',e);}
syncReleaseHeader();
NS.V034D3B2=Object.freeze({version:VERSION,frontierBefore,frontierAfter,stats,residualAudit,syncReleaseHeader});
})(window.VSim);

;
/* H1B2 bundled source: v034d3b3.js */
/* V0.34D3B3 — hot-path optimization + behavior-preserving diagnostics.
 * D3 member lookups & food accounting batching are implemented in the two
 * unprotected bootstraps v034d3.js / v034d3a.js, not in legacy source blocks.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B3',PREVIOUS='V0.34D3B2',KEY='village-observer-v034d3b3';
const stats=new WeakMap();
function performanceStats(w){let r=stats.get(w);if(!r){r={dayAdvances:0,totalAdvanceMs:0,lastAdvanceMs:0,maxAdvanceMs:0};stats.set(w,r);}return r;}
// Explicitly optional sampling, OFF by default, so everyday simulation has
// no extra timers. The ordinary V26 profiler remains the performance baseline.
let sample=false;
const previousAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){if(!sample)return previousAdvance.apply(this,args);const t=performance.now();try{return previousAdvance.apply(this,args);}finally{const ms=performance.now()-t,s=performanceStats(this);s.dayAdvances++;s.totalAdvanceMs+=ms;s.lastAdvanceMs=ms;s.maxAdvanceMs=Math.max(s.maxAdvanceMs,ms);}};
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 Village Observer 저장 파일입니다.');const old={...d,version:d.version===VERSION?PREVIOUS:d.version};if(!['V0.34D3B3',PREVIOUS,'V0.34D3B1','V0.34D3B','V0.34D3A2','V0.34D3A1','V0.34D3A'].includes(d.version))throw Error('D3B3 또는 호환되는 D3 계열 저장 파일만 지원합니다.');return prevFrom(old);};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevToJSON.call(this,w);d.version=VERSION;if(d.worldSummary){d.worldSummary.v034d3b3Revision='hotpath-membership-foodflow-batching-v1';d.worldSummary.v034d3b3Performance={samplingEnabled:sample,...performanceStats(w),legacySourceUnchanged:true,simulationBalanceUnchanged:true};}return d;};
function download(name,body,mime='application/json'){const u=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const str=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b2')||localStorage.getItem('village-observer-v034d3b1')||localStorage.getItem('village-observer-v034d3b');return str?NS.World.from(JSON.parse(str)):null;},
 export(w){download(`village-observer-v034D3B3-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B3-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B3-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B3-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B3-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B3-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');}
};
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const ret=prev.apply(this,args);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}return ret;};}
if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-12',title:'Performance Regression Optimization V1',summary:'다중 타일 정착지의 물리 멤버십 배열 재생성 및 국가 전체 주민 재탐색을 줄이고, 식량 계측을 거래 단위로 묶어 후반부 성능을 개선합니다. 경제·AI·군사·식량 수치는 변경하지 않습니다.',sections:[
 ['Settlement Hot Path',['동일 Settlement 구성 타일 조회를 재사용하되 실제 소유권·점령 상태는 매 호출 검증합니다. 합병·분할 후에는 즉시 새 배열을 사용합니다.','식량 비축일 분모는 기존 V26 살아있는 주민 인덱스를 활용하여 해당 Settlement 거주자만 순회합니다.']],
 ['Food Flow 계측',['수확 한 건의 7개 회계 항목과 입고 한 건의 3~4개 항목을 한 번의 실제 정착지 행 조회로 기록합니다.','회계 수치·CSV 48열·미설명 잔차 처리 규칙과 개척비 지출을 유지합니다.']],
 ['범위·검증',['C1H 레거시 원본 169개 파일의 해시와 모든 밸런스 상수 유지.','성능 샘플링은 기본 OFF이며 명시적으로 켜는 경우에만 고해상도 시간을 측정합니다.','B2 저장 파일을 불러올 수 있고 PC/모바일 Hosted/Standalone 빌드를 유지합니다.']]
]});
NS.RELEASE_VERSION=VERSION;
NS.V034D3B3=Object.freeze({version:VERSION,samplingEnabled:()=>sample,setSampling:v=>{sample=!!v;},stats:performanceStats});
})(window.VSim);

;
/* H1B2 bundled source: v034d3b3a.js */
/* V0.34D3B3A — export-only performance and accounting regression diagnostics.
 * No daily scans, simulation RNG, finance, pathing, military state, or inventory mutations.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B3A',PREVIOUS='V0.34D3B3',KEY='village-observer-v034d3b3a';
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const FLOW=NS.V034D3A2,FOOD_COLUMNS=['windowStart','windowEnd','partial','nationName','nationId','settlementId','tileIds','population','openingFood','closingFood','storageDelta','harvestStored','otherDeposited','mealReceived','otherWithdrawn','foodSpoiled','frontierFoodSpent','observedFoodDelta','unattributedDelta','residualClass','topologyChanged'];
function category(v){if(v>0)return 'POSITIVE_UNEXPLAINED';
 const x=-v;
 if(Math.abs(x-2.8)<.011)return 'NEGATIVE_2_8_CANDIDATE';
 if(Math.abs(x-4.2)<.011)return 'NEGATIVE_4_2_CANDIDATE';
 if(Math.abs(x-1.4)<.011)return 'NEGATIVE_1_4_CANDIDATE';
 if(Math.abs(x-.9)<.011)return 'NEGATIVE_0_9_CANDIDATE';
 if(Math.abs(x-10)<.011||Math.abs(x-13)<.011)return 'FRONTIER_AMOUNT_CANDIDATE';
 return 'NEGATIVE_OTHER_UNEXPLAINED';
}
// The underlying Food Flow rows are constructed only at user export/report time.
// Never claim that a numerical resemblance establishes the origin of a debit.
function foodAnomalies(w,limit=Infinity){const result=[],topRows=[],counts={},nationCounts={};let compared=0,skippedTopology=0,skippedPartial=0,totalResidual=0;
 for(const r of FLOW.rows(w)){
  if(r.partial==='ACTIVE'){skippedPartial++;continue;}
  if(r.topologyChanged||r.unattributedDelta==null||!Number.isFinite(Number(r.unattributedDelta))){skippedTopology++;continue;}
  compared++;const delta=Number(r.unattributedDelta);
  if(Math.abs(delta)<=.01)continue;
  const cls=category(delta);counts[cls]=(counts[cls]||0)+1;nationCounts[r.nationName||'?']=(nationCounts[r.nationName||'?']||0)+1;totalResidual+=delta;
  const item={...r,residualClass:cls};
  if(result.length<limit)result.push(item);
  topRows.push(item);if(topRows.length>15){topRows.sort((a,b)=>Math.abs(b.unattributedDelta)-Math.abs(a.unattributedDelta));topRows.pop();}
 }
 const top=topRows.sort((a,b)=>Math.abs(b.unattributedDelta)-Math.abs(a.unattributedDelta)).map(x=>({start:x.windowStart,settlementId:x.settlementId,nation:x.nationName,residual:+n(x.unattributedDelta).toFixed(4),category:x.residualClass}));
 return {compared,mismatched:Object.values(counts).reduce((a,b)=>a+b,0),skippedTopology,skippedPartial,netResidual:+totalResidual.toFixed(6),categories:counts,nations:nationCounts,top,rows:Number.isFinite(limit)?result.slice(0,limit):result};
}
function anomalyCSV(w){const a=foodAnomalies(w);const lines=[FOOD_COLUMNS.join(',')];for(const r of a.rows)lines.push(FOOD_COLUMNS.map(k=>esc(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(','));return lines.join('\n');}
function formationDiagnostics(w){const entries=w?.telemetry?.entries||[],perDay=new Map(),pairCount=new Map(),eventsByType={},top=[];let updates=0,duplicates=0,repeatControl=0;
 for(const e of entries){if(!['FORMATION_TARGET_CHANGED32D','FORMATION_CONTROL_OWNER_CHANGED33G1','FORMATION_TARGET_WRITE_BLOCKED33G1A','POSTWAR_WITHDRAWAL_MOVE33A'].includes(e.type))continue;
  eventsByType[e.type]=(eventsByType[e.type]||0)+1;
  const p=e.payload||{},day=String(e.calendarOrdinalDay24??e.ordinalDay??''),fid=String(p.formationId??'');
  if(e.type==='FORMATION_TARGET_CHANGED32D'){
   updates++;const key=[day,fid,p.fromTarget,p.toTarget,p.reason].join('|');
   if(perDay.has(key)){duplicates++;const value=(pairCount.get(key)||1)+1;pairCount.set(key,value);}
   else{perDay.set(key,1);pairCount.set(key,1);}
  }
  if(e.type==='FORMATION_CONTROL_OWNER_CHANGED33G1'&&((p.from==='POSTWAR_WITHDRAWAL'&&p.to==='PEACETIME')||(p.from==='PEACETIME'&&p.to==='POSTWAR_WITHDRAWAL')))repeatControl++;
 }
 for(const [key,count] of pairCount)if(count>1)top.push({key,count});top.sort((a,b)=>b.count-a.count);
 return {retainedWindowEvents:entries.length,eventsByType,formationTargetUpdates:updates,repeatedIdenticalTargetEvents:duplicates,postwarPeacetimeControlTransitions:repeatControl,topRepeated:top.slice(0,15),scope:'retained detail events only; no assumptions about discarded/aggregated historical detail'};
}
function download(name,body,mime='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const s=oldSerialize.call(this);s.version=VERSION;return s;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('잘못된 저장 파일입니다.');if(data.version===VERSION)return oldFrom({...data,version:PREVIOUS});return oldFrom(data);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const obj=oldJSON.call(this,w);obj.version=VERSION;
 if(obj.worldSummary){const a=foodAnomalies(w,0);obj.worldSummary.v034d3b3aRevision='read-only-residual-csv-and-formation-event-audit';obj.worldSummary.v034d3b3aAudit={food:{compared:a.compared,mismatched:a.mismatched,netResidual:a.netResidual,categories:a.categories,nations:a.nations,top:a.top},formation:formationDiagnostics(w),balanceUnchanged:true,legacySourceUnchanged:true,fullFoodFlowColumns:FLOW.columns.length};}
 return obj;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b3')||localStorage.getItem('village-observer-v034d3b2');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034D3B3A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034D3B3A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportDevCSVV2(w){download(`village-observer-v034D3B3A-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()));},
 exportSettlementCSV(w){download(`village-observer-v034D3B3A-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w));},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B3A-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w));},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B3A-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w));},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B3A-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+FLOW.foodCSV(w));},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034D3B3A-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+anomalyCSV(w));}
};
function syncHeader(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const before=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const res=before.apply(this,args);syncHeader();
 if(typeof document!=='undefined'&&!document.getElementById('exportFoodAnomaliesB3ABtn')){const near=document.getElementById('exportSettlementFoodFlowD3ABtn');if(near){const b=document.createElement('button');b.id='exportFoodAnomaliesB3ABtn';b.textContent='식량 이상 구간 CSV';b.title='미설명 식량 잔차가 ±0.01 초과인 종료된 30일 구간만 출력 · 실제 재고/회계 값 변경 없음';b.addEventListener('click',()=>{try{NS.SaveSystem.exportFoodAnomaliesCSV(this.world);}catch(e){console.error(e);alert(e.message);}});near.insertAdjacentElement('afterend',b);}}
 return res;};}
syncHeader();
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-13',title:'Performance & Food Flow Regression Audit',summary:'장기 자연주행의 미설명 식량 잔차만 경량 CSV로 출력하고, 전후 Formation 목표 반복 이벤트를 진단합니다. B3 최적화와 기존 경제·전쟁·식량 규칙은 변경하지 않습니다.',sections:[
 ['Food Flow 감사',['기존 48열 전체 Food Flow CSV는 유지합니다.','별도 식량 이상 구간 CSV는 종료된 30일 구간의 미설명 잔차 절댓값이 0.01을 초과하는 행만 출력합니다.','-0.9, -1.4, -2.8, -4.2 등의 수치 패턴은 원인 추정용 분류일 뿐 실제 차감 원인으로 확정하지 않습니다.']],
 ['군사 Formation 감사',['최근 상세 Devlog의 같은 날짜·Formation·목표 변경 중복 횟수 및 전후 철수↔평시 제어권 변동을 보고합니다.','전쟁·후퇴·Formation 이동, 제어권 우선순위와 실제 대상 설정은 수정하지 않습니다.']],
 ['검증 범위',['B2·B3·B3A 동일 상태 성능 및 짧은 결정론 회귀를 지원합니다.','C1H 보호 소스 169개와 Snapshot V2 1,683열, Food Flow 48열 유지.','전체 PC 75년 자연주행 성능 회귀율은 별도 통제 실험이 필요합니다.']]
]});
NS.RELEASE_VERSION=VERSION;
NS.V034D3B3A=Object.freeze({version:VERSION,foodAnomalies,anomalyCSV,formationDiagnostics,columns:FOOD_COLUMNS});
})(window.VSim);

;
/* H1B2 bundled source: v034d3b3b.js */
/* V0.34D3B3B — Single-pass physical stock & Food Flow telemetry.
 * Actual stock decisions and numerical transaction ordering are unchanged.
 * D3A's observation uses the exact membership and pre-transaction stock from
 * the real D3 operation, avoiding a redundant O(settlement) inspection.
 */
(function(NS){'use strict';
const VERSION='V0.34D3B3B',PREVIOUS='V0.34D3B3A',KEY='village-observer-v034d3b3b';
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=prevSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 저장 파일입니다.');return d.version===VERSION?prevFrom({...d,version:PREVIOUS}):prevFrom(d);};
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=prevJSON.call(this,w);out.version=VERSION;if(out.worldSummary){out.worldSummary.v034d3b3bRevision='single-pass-stock-telemetry';out.worldSummary.v034d3b3bAudit={observedWithoutSecondMembershipScan:true,foodFlowColumns:NS.V034D3A2.columns.length,balanceRulesUnchanged:true,legacySourceUnchanged:true};}return out;};
function download(name,body,mime='application/json'){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034d3b3a')||localStorage.getItem('village-observer-v034d3b3')||localStorage.getItem('village-observer-v034d3b2');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034D3B3B-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034D3B3B-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportDevCSVV2(w){download(`village-observer-v034D3B3B-v2-snapshots-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D0.csvV2(w.telemetry.snapshotsCSV()),'text/csv;charset=utf-8');},
 exportSettlementCSV(w){download(`village-observer-v034D3B3B-settlements-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D1A.csv(w),'text/csv;charset=utf-8');},
 exportSettlementHousingCSV(w){download(`village-observer-v034D3B3B-housing-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D2.csv(w),'text/csv;charset=utf-8');},
 exportSettlementEconomyCSV(w){download(`village-observer-v034D3B3B-economy-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3.csv(w),'text/csv;charset=utf-8');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034D3B3B-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3A2.foodCSV(w),'text/csv;charset=utf-8');},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034D3B3B-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+NS.V034D3B3A.anomalyCSV(w),'text/csv;charset=utf-8');}
};
function renderVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
/* H1B2: redundant version-only UI wrapper omitted */
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-13',title:'Simulation Hotpath Optimization — Stock & Food Flow',summary:'Settlement 물리 재고 출납과 Food Flow 계측의 중복 멤버십·재고 조회를 단일 패스로 합칩니다. 시뮬레이션 식량·경제·전쟁·AI 수식은 그대로입니다.',sections:[
 ['중복 검사 제거',['기존 D3 출납에서 얻은 실제 Settlement 멤버십과 출납 전 타일 재고를 D3A Food Flow 관측에 직접 전달합니다.','관측용 별도 members()·물리 용량 재조회와 중복 계측 행 탐색을 줄입니다.']],
 ['보존·호환',['물리 재고·자원 생산·주민 식사·개척·군사 규칙은 변경하지 않습니다.','기존 B3A 저장파일 읽기, Snapshot V2 1,683열과 Food Flow 48열, 경량 이상 CSV 유지.']],
 ['검증 범위',['동일 시드 B3A/B3B의 자원·난수·회계 행을 직접 비교하고, 실제 World.advanceOneDay 처리시간을 비교합니다.','후반 60~80년 PC 체감 속도는 동일 기기 자연주행 재검증이 필요합니다.']]
]});
NS.RELEASE_VERSION=VERSION;
NS.V034D3B3B=Object.freeze({version:VERSION,usesSharedObservation:true,foodFlowColumns:NS.V034D3A2.columns.length});
})(window.VSim);

;
/* H1B2 bundled source: v034e.js */
/* V0.34E-rc4h — on-demand profiling foundation.
 * No simulation decisions are modified. Method instrumentation is INSTALLED
 * only during a manually requested sample and restored at stop().
 */
(function(NS){'use strict';
const VERSION='V0.34E-rc5';
const PREVIOUS='V0.34D3B3B';
const SAVE_KEY='village-observer-v034e-rc5';
const names=[
 ['World','advanceOneDay','world.day'],
 ['World','socialAndMigration','macro.socialAndMigration'],
 ['World','processAutonomousTrade','macro.autonomousTrade'],
 ['World','checkExtinctions','macro.extinctionReview'],
 ['World','processRuins','macro.ruinReview'],
 ['World','anomalyCheck','macro.anomalyCheck'],
 ['Village','maintainSettlements','macro.maintenance'],
 ['Village','processBuildingMaintenance','macro.buildingMaintenance'],
 ['Village','developSettlements','macro.development'],
 ['Person','act','person.act'],
 ['Person','metabolism','person.metabolism'],
 ['Person','chooseJob','person.jobReview'],
 ['Village','dailyTick','settlement.daily'],
 ['Village','seasonalTick','settlement.seasonal'],
 ['Village','internalMigration','settlement.migration'],
 ['Village','withdrawAt','stock.withdraw'],
 ['Village','depositAt','stock.deposit'],
 // Stock reads may occur hundreds of thousands of times; sample separately (avoid observer effect).
 // ['Village','stockAt','stock.read'],
 // ['Village','settlementReserveDays','food.reserveRead'],
 ['VillageBrain','seasonalDecision','ai.seasonalDecision'],
 ['Telemetry','record','telemetry.event'],
 ['Telemetry','snapshot','telemetry.snapshot']
];
let session=null,last=null;
const now=()=>performance.now();
function report(s){
 const rows=Object.entries(s.rows).map(([name,v])=>({name,calls:v.calls,inclusiveMs:+v.inclusiveMs.toFixed(3),exclusiveMs:+v.exclusiveMs.toFixed(3),avgInclusiveUs:v.calls?+(v.inclusiveMs/v.calls*1000).toFixed(3):0}));
 rows.sort((a,b)=>b.exclusiveMs-a.exclusiveMs);
 return {format:'vilob-performance-e01',version:VERSION,sourceVersion:PREVIOUS,mode:'instrumented-only',yearAtStart:s.startYear,dayAtStart:s.startDay,days:s.days,requestedDays:s.requestedDays,totalWorldMs:+s.totalWorldMs.toFixed(3),perSimDayMs:s.days?+(s.totalWorldMs/s.days).toFixed(3):0,rows,notes:['Nested method times must not be added to their parent inclusive totals.','Instrumentation introduces overhead; use the uninstrumented CLI benchmark for release speed comparison.','Performance samples never alter gameplay RNG or resource quantities.']};
}
function stop(){if(!session)return last;const s=session;session=null;for(let i=s.patches.length-1;i>=0;i--){const p=s.patches[i];p.proto[p.method]=p.original;}last=report(s);return last;}
function start(world,days=30){
 if(session)throw Error('V0.34E profiler is already recording.');
 if(!(world instanceof NS.World))throw Error('World instance required');
 days=Math.max(1,Math.min(360,Math.trunc(Number(days)||30)));
 const s={world,requestedDays:days,days:0,totalWorldMs:0,startYear:world.year,startDay:world.ordinalDay?.(),rows:{},stack:[],patches:[]};
 session=s;
 try{
 for(const [className,method,label] of names){const proto=NS[className]?.prototype;if(!proto||typeof proto[method]!=='function')continue;
  const original=proto[method];s.rows[label]={calls:0,inclusiveMs:0,exclusiveMs:0};
  proto[method]=function(...args){
   // Other World objects are not sampled. Nested calls in the sampled world
   // naturally run while the selected World.advanceOneDay frame is active.
   if(session!==s || (label==='world.day'&&this!==world) || (label!=='world.day'&&!s.stack.length))return original.apply(this,args);
   const frame={label,start:now(),children:0};s.stack.push(frame);
   let errored=false;
   try{return original.apply(this,args);}catch(err){errored=true;throw err;}finally{
    const elapsed=now()-frame.start;s.stack.pop();
    const row=s.rows[label];row.calls++;row.inclusiveMs+=elapsed;row.exclusiveMs+=Math.max(0,elapsed-frame.children);
    if(s.stack.length)s.stack[s.stack.length-1].children+=elapsed;
    if(label==='world.day'){
     s.days++;s.totalWorldMs+=elapsed;
     if(errored||s.days>=s.requestedDays)stop();
    }
   }
  };
  s.patches.push({proto,method,original});
 }
 return {active:true,requestedDays:days,startYear:s.startYear,startDay:s.startDay};
 }catch(e){stop();throw e;}
}
function status(){return session?{active:true,days:session.days,requestedDays:session.requestedDays,totalWorldMs:session.totalWorldMs}: {active:false,lastDays:last?.days||0};}
function download(name,body,mime='application/json'){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function traceSegment(name,fn){const s=session;if(!s||!s.stack.length)return fn();const frame={label:name,start:now(),children:0};s.stack.push(frame);try{return fn();}finally{const dt=now()-frame.start;s.stack.pop();const row=s.rows[name]||(s.rows[name]={calls:0,inclusiveMs:0,exclusiveMs:0});row.calls++;row.inclusiveMs+=dt;row.exclusiveMs+=Math.max(0,dt-frame.children);if(s.stack.length)s.stack[s.stack.length-1].children+=dt;}}
const profiler=Object.freeze({start,stop,status,get traceSegmentActive(){return session?traceSegment:null;},last:()=>last,labels:names.map(x=>x[2]),exportJSON(){const r=last||stop();if(!r)throw Error('먼저 성능 계측을 수행하세요.');download('village-observer-v034E-rc5-performance.json',JSON.stringify(r,null,2));return r;}});
NS.V034E=Object.freeze({version:VERSION,profiling:profiler});
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('Invalid save data');return oldFrom([VERSION,'V0.34E-rc4h','V0.34E-rc4','V0.34E-rc3','V0.34E-rc2','V0.34E-rc1'].includes(d.version)?{...d,version:PREVIOUS}:d);};
// E-02: Full Snapshot cadence is deliberately retained. Late synthetic A/B showed
// world/RNG divergence when these old observer callbacks were skipped.
const prevJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=prevJSON.call(this,w);d.version=VERSION;if(d.worldSummary)d.worldSummary.v034eRevision='E05_macro_job_review_and_benchmark_warmup';if(d.worldSummary)d.worldSummary.v034eTelemetry={autoSnapshotPolicy:"UNCHANGED_B3B",eventPruneMinIntervalOrdinal:30,eventRetentionThreshold:16000,highFrequencyProfilerDefault:"OFF"};return d;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const keys=[SAVE_KEY,'village-observer-v034e-rc4','village-observer-v034e-rc3','village-observer-v034e-rc2','village-observer-v034e-rc1','village-observer-v034d3b3b','village-observer-v034d3b3a','village-observer-v034d3b3','village-observer-v034d3b2'];let raw;for(const key of keys){raw=localStorage.getItem(key);if(raw)break;}return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034E-rc5-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034E-rc5-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));}
};
function updateVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
function profilerUI(w){if(typeof document==='undefined')return;const p=document.getElementById('v30aPerfPanel');if(!p||!p.parentElement)return;
 let host=document.getElementById('v034eE01Panel');if(!host){host=document.createElement('div');host.id='v034eE01Panel';host.className='panel';host.innerHTML='<div class="section-head"><h2>0.34E 실험실 · 선택형 성능 계측</h2><span class="tag">E-05</span></div><div class="small muted" id="v034eE01Status">계측 비활성 (일반 플레이 성능 오버헤드 없음)</div><div class="button-grid"><button id="v034eStart">다음 30일 계측</button><button id="v034eStop">계측 중지</button><button id="v034eExport">성능 JSON 내보내기</button></div><div class="small muted">계측 ON은 시간을 추가로 사용하므로 일반 성능 수치와 비교하지 마세요. 실제 세이브는 동봉된 benchmark-local.html로 PC에서 비교 가능.</div>';
  p.insertAdjacentElement('afterend',host);
  host.querySelector('#v034eStart').onclick=()=>{try{profiler.start(w,30);}catch(e){alert(e.message);}profilerUI(w);};
  host.querySelector('#v034eStop').onclick=()=>{profiler.stop();profilerUI(w);};
  host.querySelector('#v034eExport').onclick=()=>{try{profiler.exportJSON();}catch(e){alert(e.message);}};
 }
 const state=status(),el=host.querySelector('#v034eE01Status');if(el)el.textContent=state.active?'계측 '+state.days+'/'+state.requestedDays+'일 진행':last?'최근 계측 '+last.days+'일 · SIM 평균 '+last.perSimDayMs+'ms/일 (프로파일러 ON)':'계측 비활성 (일반 플레이 성능 오버헤드 없음)';
}
if(NS.UI){const priorHeader=NS.UI.prototype.renderHeader,priorWorld=NS.UI.prototype.renderWorld;
 NS.UI.prototype.renderHeader=function(...a){const ret=priorHeader.apply(this,a);updateVersion();return ret;};
 NS.UI.prototype.renderWorld=function(...a){const ret=priorWorld.apply(this,a);profilerUI(this.world);return ret;};
}
updateVersion();
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({
 version:VERSION,date:'2026-10-14',title:'0.34E RC5 — 노동 결정·예열 벤치마크',
 summary:'시뮬레이션의 난수·시점·물자 규칙을 유지하면서 노동 후보 탐색의 중복 읽기를 제거하고, 독립 예열형 A/B 도구를 도입합니다.',
 sections:[
  ['노동 결정 읽기 최적화',['건축가의 진행 중 공사 위치 목록을 한 번 구축해 같은 결정 내 반복 탐색을 줄입니다.','직업 검사에서 중복된 홈 타일 조회를 제거합니다. AIProfile 계측 카운터 및 상태 변경 함수 호출은 그대로 유지합니다.']],
  ['예열형 벤치마크',['같은 HTML 안에서 별도 세계를 예열한 뒤 원본 세이브를 복원합니다.','예열 후 시작 상태 지문 검사, 3~5회 교차 실험, 회차별 개선율을 제공합니다.']],
  ['보존 및 검증',['Snapshot 호출 빈도 및 F5/F5A attachWorld는 RC4h와 동일하게 유지합니다.','실제 61년차 세이브의 성능 판정은 사용자 로컬 교차 시험으로 확인합니다.']]
 ]
});
NS.RELEASE_VERSION=VERSION;
})(window.VSim);

;
/* H1B2 bundled source: v034f0.js */
/* Village Observer V0.34F0 — Settlement ration planning + individual survival.
 * Explicit MODEL CHANGE: physical food is withdrawn once per settlement/cycle,
 * and a deterministic weighted allocation is passed to individual residents.
 * Personal hunger/energy/health/happiness remain individually simulated.
 */
(function(NS){'use strict';
const VERSION='V0.34F0',PREVIOUS='V0.34E-rc5',KEY='village-observer-v034f0';
const D3=NS.V034D3,OBS=NS.V034D3A;
const stateByWorld=new WeakMap(), perfByWorld=new WeakMap();
const clamp=(x,lo=0,hi=100)=>Math.max(lo,Math.min(hi,Number(x)||0));
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const cal=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
function cycleState(w){const stamp=cal(w);let s=stateByWorld.get(w);if(!s||s.stamp!==stamp){s={stamp,nations:new Map(),groups:[],cycles:0,residents:0,requested:0,received:0,delivered:0,returned:0,returnFailed:0,missing:0};stateByWorld.set(w,s);}return s;}
function nationState(w,v,s){let n=s.nations.get(v);if(n)return n;
 const groups=new Map(),homeToGroup=new Map();
 for(const p of v.residents||[]){if(!p.alive)continue;const tid=Number(p.homeTileId),tile=w.map.get(tid);if(!tile||String(tile.ownerId)!==String(v.id))continue;
  const sid=tile.settlementId!=null?String(tile.settlementId):'tile-'+tid;
  let group=groups.get(sid);if(!group){group={sid,anchor:tid,members:[],v,w,started:false,rations:new Map(),used:new Set(),received:0,requested:0,delivered:0};groups.set(sid,group);s.groups.push(group);}
  group.members.push(p);homeToGroup.set(tid,group);
 }
 n={groups,homeToGroup};s.nations.set(v,n);return n;
}
function needFor(p){const base=p.age<15?.28:.39;const military=(p.assignment==='MILITARY'||p.job==='경비'||p.formationId!=null)?1.09:1;return base*military;}
function priorityFor(p,policy='BALANCED'){let weight=1;if(p.age<15)weight+=.20;else if(p.age>=65)weight+=.10;
 if(num(p.health)<40)weight+=.14; if(p.assignment==='MILITARY'||p.job==='경비')weight+=.08;
 if(['농부','채집꾼','사냥꾼','광부','목수','건축가','철공'].includes(p.job))weight+=.04;
 if(policy==='CHILD_FIRST'&&p.age<15)weight+=.3;
 if(policy==='WORK_FIRST'&&p.age>=15&&p.age<65)weight+=.22;
 return weight;
}
function allocate(members,total,policy){const arr=members.map(p=>({p,need:needFor(p),weight:priorityFor(p,policy),given:0}));
 // Weighted water filling. A complete group never consumes beyond its actual withdrawal.
 let left=Math.max(0,total),active=arr.slice();for(let round=0;round<4&&left>1e-10&&active.length;round++){
  const denom=active.reduce((sum,a)=>sum+a.need*a.weight,0);if(denom<=0)break;
  let spent=0;for(const a of active){const share=left*a.need*a.weight/denom,amount=Math.min(Math.max(0,a.need-a.given),share);a.given+=amount;spent+=amount;}
  left=Math.max(0,left-spent);active=active.filter(a=>a.need-a.given>1e-10);
 }
 if(left>1e-9){for(const a of arr){if(left<=1e-9)break;const extra=Math.min(a.need-a.given,left);a.given+=extra;left-=extra;}}
 return arr;
}
function prepare(group,s){if(group.started)return;group.started=true;const {w,v}=group,people=group.members;let requested=0;for(const p of people)requested+=needFor(p);
 group.requested=requested;s.requested+=requested;s.residents+=people.length;s.cycles++;
 // Settlement membership and stock are resolved once for the entire group.
 const m=D3?.members(v,group.anchor),available=Math.max(0,Number(v.stockAt(group.anchor,'food')||0));
 let capacity=0;
 for(const id of m?.ids||[group.anchor]){const tile=w.map.get(id);
  if(NS.V034F2?.enabled&&NS.V034D2?.capAt){capacity+=NS.V034D2.capAt(tile);continue;}
  for(let i=0;i<(tile?.buildings||[]).length;i++){
   if(num(tile.buildingCondition?.[i]??100)<=0)continue;
   capacity+=Math.max(0,num(NS.BUILDINGS?.[tile.buildings[i]]?.capacity));
  }
 }
 group.housingStress=people.length?Math.min(1,Math.max(0,(people.length-capacity)/people.length)):0;
 const target=Math.min(requested,available),got=Math.max(0,Number(v.withdrawAt(group.anchor,'food',target)||0));
 group.received=got;s.received+=got;
 const policy=['BALANCED','CHILD_FIRST','WORK_FIRST'].includes(v.v034f0RationPolicy)?v.v034f0RationPolicy:'BALANCED';
 const allotments=allocate(people,got,policy);
 // F1 observational hook: allocation has already been determined, so this
 // cannot influence inventory, Person order, or RNG.
 if(NS.V034F1?.recordRation){let hungerHigh=0,healthLow=0;for(const person of people){if(num(person.hunger)>=85)hungerHigh++;if(num(person.health)<25)healthLow++;}
  NS.V034F1.recordRation(w,v,group,{requested,received:got,available,population:people.length,hungerHigh,healthLow});}
 for(const a of allotments)group.rations.set(a.p,a);
 // D3's physical withdrawal records the reserve as 'otherWithdrawn'. Relabel it
 // as meals in the existing 30-day ledger without creating/removing physical food.
 if(OBS){OBS.addMetric(w,v,group.anchor,'otherWithdrawn',-got);OBS.addMetric(w,v,group.anchor,'mealReceived',got);OBS.addMetric(w,v,group.anchor,'mealRequested',requested);}
 const stats=NS.V034D3?.stats?.(w);if(stats){stats.foodMealCalls+=people.length;stats.foodMealRequested+=requested;stats.foodMealReceived+=got;}
}
function survive(p,v,w,worked,amount,need,housingStress=0){
 const ratio=need>0?Math.min(1,Math.max(0,amount/need)):1;
 p.hunger=clamp(num(p.hunger)+NS.V034G4A.hungerGain((worked?5+Math.random()*3:4+Math.random()*2),ratio));
 p.energy=clamp(num(p.energy)-(worked?8+Math.random()*5:4+Math.random()*3));
 const before=p.hunger;
 if(amount>0){const curve=1-Math.pow(1-clamp(before/100,0,1),2);const relief=(5+Math.random()+(3+Math.random())*curve)*ratio*NS.V034G4A.reliefFactor(before);
  p.hunger=clamp(p.hunger-relief);
  NS.V032E11?.recordHungerRelief?.(p,v,w,before-p.hunger);
  NS.V032E12?.recordHungerCurve?.(p,v,w,before,before-p.hunger,relief);
 }
 NS.V032E10?.recordMeal?.(p,v,w,need,amount,ratio>=.8);
 p.energy=clamp(p.energy+(worked?8+Math.random()*5:10+Math.random()*5)*(.65+.35*ratio));
 p.energy+=(82-p.energy)*.035;
 let delta=(82-num(p.health))*.002-NS.V034F3.nutritionLoss(ratio,p.hunger);
 if(p.age>60)delta-=.035;
 p.health=clamp(num(p.health)+delta);
 if(v.hasTech?.('SANITATION')&&p.alive&&p.health<86&&p.hunger<70)p.health=Math.min(100,p.health+.012);
 if(housingStress>0){p.housingStrainDays=num(p.housingStrainDays)+1;
  if(p.housingStrainDays>20){p.energy=clamp(p.energy-.035-.11*housingStress);}
  if(p.housingStrainDays>45)p.health=clamp(p.health-.01-.035*housingStress);
 }else p.housingStrainDays=Math.max(0,num(p.housingStrainDays)-2);
 NS.V034F3.updateHappiness(p,v,w,ratio,housingStress);
 if(p.hunger<95)p._v30b3Hunger100SinceCal=null;
 // One individual health/hunger experience despite collective food allocation.
 return ratio;
}
NS.Person.prototype.metabolism=function(v,w,worked=true){if(!this.alive)return;
 const s=cycleState(w),n=nationState(w,v,s),tile=w.map.get(Number(this.homeTileId)),sid=tile?.settlementId!=null?String(tile.settlementId):'tile-'+this.homeTileId;
 const group=n.groups.get(sid)||n.homeToGroup.get(Number(this.homeTileId));
 if(!group){s.missing++;NS.V034F2?.missingHome?.(w,this);survive(this,v,w,worked,false,needFor(this));return;}
 prepare(group,s);
 const a=group.rations.get(this);if(!a||group.used.has(this))return;
 group.used.add(this);group.delivered+=a.given;s.delivered+=a.given;
 survive(this,v,w,worked,a.given,a.need,group.housingStress);
};
function settleCycle(w){const s=stateByWorld.get(w);if(!s)return;
 for(const g of s.groups){if(!g.started)continue;const unused=Math.max(0,g.received-g.delivered);if(unused<1e-8)continue;
  const returned=Number(g.v.depositAt(g.anchor,'food',unused)||0);s.returned+=returned;s.returnFailed+=Math.max(0,unused-returned);
  // Actual refund is not a new production input and unused reserve is not a meal.
  // Refund is a real 'otherDeposited' entry: together with the earlier
  // allocation withdrawal it preserves the physical opening/closing ledger.
  // Report delivered consumption separately, as mealReceived includes reservations.
 }
 const next=stats(w);next.cycles+=s.cycles;next.residents+=s.residents;next.requested+=s.requested;next.consumed+=s.delivered;
 next.unspent+=s.returnFailed;next.returned+=s.returned;next.unmatched+=s.missing;
 stateByWorld.delete(w);
}
function stats(w){let s=perfByWorld.get(w);if(!s){s={cycles:0,residents:0,requested:0,consumed:0,unspent:0,returned:0,unmatched:0,years:{},lastPerfSample:-1,yearlyExceeded:0};perfByWorld.set(w,s);}return s;}
const advance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){try{return advance.apply(this,args);}finally{settleCycle(this);}};
function samplePerf(w){if(Number(w.speed)!==10)return;const p=w._v26Perf;if(!p||!Number.isFinite(p.simMs))return;const s=stats(w),index=num(p.samples);if(index<=s.lastPerfSample)return;s.lastPerfSample=index;
 const yr=Math.max(1,Number(w.year)||1),b=num(p.simMs);const r=s.years[yr]||(s.years[yr]={year:yr,samples:0,sum:0,max:0,over:0,pop:0,settlements:0});
 r.samples++;r.sum+=b;r.max=Math.max(r.max,b);if(b>=1000){r.over++;s.yearlyExceeded++;}
 r.pop=(w.villages||[]).reduce((n,v)=>n+(v.residents||[]).reduce((k,p)=>k+(p.alive?1:0),0),0);
 r.settlements=(w.v34b?.settlements||[]).filter(x=>x.lifecycle==='ACTIVE').length;
}
function performanceReport(w){const s=stats(w),years=Object.values(s.years).sort((a,b)=>a.year-b.year).map(r=>({...r,meanMs:r.samples?r.sum/r.samples:0}));
 return {version:VERSION,metric:'in-game smoothed SIM/BATCH',requiredSpeed:10,thresholdMs:1000,maxYear:150,years,allSamples:years.reduce((a,r)=>a+r.samples,0),overThresholdSamples:s.yearlyExceeded,model:{cycle:'Settlement pooled ration + Person survival',note:'old/new model numerical and RNG identity is not required'},consumption:{cycles:s.cycles,residents:s.residents,requested:s.requested,consumed:s.consumed,returned:s.returned,returnFailed:s.unspent,unmatched:s.unmatched}};
}
function download(filename,content,mime){const url=URL.createObjectURL(new Blob([content],{type:mime||'application/json'})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=oldSerialize.call(this);data.version=VERSION;const s=stats(this);data.v034f0Performance={...s,years:s.years};data.v034f0Policies=(this.villages||[]).map(v=>[v.id,v.v034f0RationPolicy||'BALANCED']);return data;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('Invalid save');const w=oldFrom(data.version===VERSION?{...data,version:PREVIOUS}:data);const prev=data.v034f0Performance;if(prev&&typeof prev==='object'){const s=stats(w);for(const k of ['cycles','residents','requested','consumed','unspent','returned','unmatched','yearlyExceeded'])s[k]=num(prev[k]);s.years=prev.years||{};s.lastPerfSample=num(w._v26Perf?.samples);}if(Array.isArray(data.v034f0Policies))for(const [id,policy] of data.v034f0Policies){const v=(w.villages||[]).find(x=>String(x.id)===String(id));if(v)v.v034f0RationPolicy=policy;}return w;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=oldJSON.call(this,w);out.version=VERSION;if(out.worldSummary){out.worldSummary.v034f0={model:'SETTLEMENT_RATION_B',metabolism:performanceReport(w).consumption,performance:performanceReport(w)};}return out;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034e-rc5');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F0-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034F0-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportF0Perf(w){download(`village-observer-v034F0-performance-${w.year}y.json`,JSON.stringify(performanceReport(w),null,2));}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const v=document.getElementById('versionBadge');if(v)v.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const prior=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...args){const result=prior.apply(this,args),w=this.world;if(w)samplePerf(w);badge();
  if(typeof document!=='undefined'&&w){let host=document.getElementById('v034f0PerfPanel'),parent=document.getElementById('v30aPerfPanel')||document.getElementById('v034eE01Panel')||document.getElementById('runtimeStatus')||document.getElementById('versionBadge');
   if(parent?.parentElement){if(!host){host=document.createElement('div');host.id='v034f0PerfPanel';host.className='panel';host.innerHTML='<div class="section-head"><h2>F0 · 150년 성능 목표</h2><span class="tag">×10 / 1000ms</span></div><div id="v034f0PerfText" class="small muted"></div><button id="v034f0PerfExport">×10 성능 기록 JSON</button>';parent.insertAdjacentElement('afterend',host);host.querySelector('#v034f0PerfExport').onclick=()=>NS.SaveSystem.exportF0Perf(this.world);}
    const r=performanceReport(w),rows=r.years,peak=rows.reduce((v,x)=>Math.max(v,x.max),0),t=host.querySelector('#v034f0PerfText');if(t)t.textContent=`기록 ${r.allSamples}배치 · 최고 ${peak.toFixed(1)}ms · 1000ms 초과 ${r.overThresholdSamples}회 · 올해 ${w.year}년 · ×10에서만 공식 집계`;}
  }
  return result;};
}
badge();
try{window.villageObserver?.renderHeader?.();}catch(e){}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-14',title:'Settlement Metabolism B — 개인 생존·정착지 차등 배급',summary:'개별 주민의 Hunger·Health를 유지하고 식량 수요·출납을 정착지 단위로 통합합니다. 구버전과 생존 결과 및 RNG는 달라질 수 있습니다.',sections:[['정착지 배급',['기본·추가 식량 수요를 합쳐 Settlement별 배급량을 계산합니다.','아동·노약자·건강 취약자·근로자·군인에 따라 배급 우선순위를 다르게 적용하며 실제 재고에서 일괄 출납합니다.']],['개인 생존',['주민별 Hunger·Energy·Health·Happiness와 기아 누적 상태를 유지합니다.','영양 부족 정도에 따라 개인의 Hunger 완화와 건강 악화를 연속적으로 처리합니다.']],['성능·검증',['PC ×10 자연주행에서 인게임 SIM/BATCH 1000ms 미만, 150년까지 유지하는 것을 최종 목표로 삼습니다.','연도별 평활 SIM/BATCH 최고치·평균·초과 횟수와 인구·Settlement 수를 기록합니다.','F0는 모델 개편이므로 기존 버전과 RNG/수치 동등성은 요구하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034F0=Object.freeze({version:VERSION,performanceReport,recordBatch:samplePerf,metabolismStats:w=>({...stats(w)}),needFor,priorityFor,survive});
})(window.VSim);

;
/* H1B2 bundled source: v034f1.js */
/* Village Observer V0.34F1 — starvation attribution and bounded late-sim tracing.
 * NO food/health/birth/death equation changes. Observer-only hooks use existing
 * pooled-ration results and never withdraw resources or consume RNG.
 */
(function(NS){'use strict';
const VERSION='V0.34F1',PREVIOUS='V0.34F0',SAVE_KEY='village-observer-v034f1';
const diagnosis=new WeakMap(), traces=new WeakMap();
const clock=()=>typeof performance==='object'&&performance.now?performance.now():Date.now();
const safe=n=>Number.isFinite(Number(n))?Number(n):0;
const ordinal=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
function fresh(){return {windowDays:1800,months:{},totals:{groups:0,requested:0,received:0,shortage:0,partialGroups:0,criticalGroups:0},last:{}};}
function diag(w){let d=diagnosis.get(w);if(!d){d=fresh();diagnosis.set(w,d);}return d;}
function prune(d,month){if(!Number.isInteger(month)||month%6!==0||month===d._prunedMonth)return;d._prunedMonth=month;const cutoff=month-Math.ceil(d.windowDays/30);for(const key of Object.keys(d.months)){if(Number(key.split('|')[0])<cutoff)delete d.months[key];}}
// Called exactly once per Settlement food cycle. No extra inventory access.
function recordRation(w,v,g,info){const requested=safe(info.requested),received=safe(info.received);if(requested<=0)return;
 const day=ordinal(w),month=Math.floor(day/30),pop=Math.max(0,safe(info.population)),ratio=Math.max(0,Math.min(1,received/requested));
 const d=diag(w),t=d.totals;t.groups++;t.requested+=requested;t.received+=received;
 const short=Math.max(0,requested-received),partial=ratio<.999999,critical=ratio<.8;
 if(partial){t.shortage+=short;t.partialGroups++;if(critical)t.criticalGroups++;}
 // Record healthy groups only monthly, but record every food-short group. This
 // prevents a 150-year, per-day, per-Settlement history from accumulating.
 if(!partial && day%30!==0)return;
 const key=month+'|'+String(v.id)+'|'+String(g.sid),b=d.months[key]||(d.months[key]={month,nationId:String(v.id),nationName:String(v.name),settlementId:String(g.sid),samples:0,shortageCycles:0,criticalCycles:0,requested:0,received:0,popMax:0,hungerHighMax:0,healthLowMax:0,localFoodMin:null,lastDay:0});
 b.samples++;b.shortageCycles+=Number(partial);b.criticalCycles+=Number(critical);b.requested+=requested;b.received+=received;b.popMax=Math.max(b.popMax,pop);b.hungerHighMax=Math.max(b.hungerHighMax,safe(info.hungerHigh));b.healthLowMax=Math.max(b.healthLowMax,safe(info.healthLow));b.localFoodMin=b.localFoodMin===null?safe(info.available):Math.min(b.localFoodMin,safe(info.available));b.lastDay=day;
 if(partial)d.last[String(v.id)]={month,day,settlementId:String(g.sid),ratio,missing:short,hungerHigh:safe(info.hungerHigh),healthLow:safe(info.healthLow)};
 prune(d,month);
}
function report(w){const d=diag(w),rows=Object.values(d.months).sort((a,b)=>a.month-b.month||a.nationId.localeCompare(b.nationId)||a.settlementId.localeCompare(b.settlementId));
 const nations={};for(const r of rows){const n=nations[r.nationId]||(nations[r.nationId]={nationId:r.nationId,nationName:r.nationName,requested:0,received:0,shortageCycles:0,criticalCycles:0,settlements:new Set()});n.requested+=r.requested;n.received+=r.received;n.shortageCycles+=r.shortageCycles;n.criticalCycles+=r.criticalCycles;n.settlements.add(r.settlementId);}
 return {format:'vilob-f1-survival-diagnostics',version:VERSION,year:w.year,day:ordinal(w),retentionDays:d.windowDays,model:'F0 pooled ration UNCHANGED',semantics:'Rows sample every shortage cycle and only one normal cycle per month; not complete food-accounting totals. totals reflects runtime since diagnostic initialization, may reset on imported F0 saves.',totals:{...d.totals},nationSummary:Object.values(nations).map(n=>({...n,settlements:n.settlements.size,shortageRatio:n.requested?+(100*(n.requested-n.received)/n.requested).toFixed(3):0})),rows};
}
const session={active:null,last:null};
function startTrace(w,days=60){if(session.active)throw Error('이미 1개 세계의 성능 계측이 진행 중입니다.');if(!(w instanceof NS.World))throw Error('World 객체가 필요합니다.');const target=Math.max(1,Math.min(360,Math.trunc(Number(days)||60)));session.active={world:w,remaining:target,days:[],startYear:w.year,startOrdinal:ordinal(w),snapshotMs:0,snapshotCalls:0};return {started:true,days:target,year:w.year};}
function stopTrace(){if(!session.active)return session.last;const a=session.active;session.active=null;session.last={format:'vilob-f1-daily-trace',version:VERSION,startYear:a.startYear,startOrdinal:a.startOrdinal,completedDays:a.days.length,days:a.days,notes:['SIM-day elapsed includes instrumented snapshot; nested times are not additive.','Performance instrumentation ON changes timing; compare RC5/F1 speed using uninstrumented A/B, not this trace.','6th/51st labels refer to offset from trace start, not calendar day-of-quarter.']};return session.last;}
const prevSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){const a=session.active;if(!a||a.world!==w)return prevSnapshot.call(this,w,...args);const t=clock();try{return prevSnapshot.call(this,w,...args);}finally{a.snapshotMs+=clock()-t;a.snapshotCalls++;}};
const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const a=session.active;if(!a||a.world!==this)return prevAdvance.apply(this,args);const t=clock(),s0=a.snapshotMs,c0=a.snapshotCalls,year=this.year,date=ordinal(this),index=a.days.length+1;let failure;
 try{return prevAdvance.apply(this,args);}catch(e){failure=e;throw e;}finally{const elapsed=clock()-t; a.days.push({offset:index,year,ordinal:date,elapsedMs:+elapsed.toFixed(3),snapshotMs:+(a.snapshotMs-s0).toFixed(3),snapshotCalls:a.snapshotCalls-c0,macro:date%3===0,population:undefined});a.remaining--;if(failure||a.remaining<=0)stopTrace();}};
function download(name,obj){const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const out=oldSerialize.call(this);out.version=VERSION;const d=diag(this);out.v034f1Diagnosis={windowDays:d.windowDays,months:d.months,totals:d.totals,last:d.last};return out;};
NS.World.from=function(input){if(!input||typeof input!=='object')throw Error('Invalid save');const w=oldFrom(input.version===VERSION?{...input,version:PREVIOUS}:input),d=input.v034f1Diagnosis;
 if(d&&typeof d==='object'){const q=diag(w);q.windowDays=Math.max(30,Math.min(1800,safe(d.windowDays)||1800));q.months=d.months&&typeof d.months==='object'?d.months:{};q.totals={...q.totals,...(d.totals||{})};q.last=d.last&&typeof d.last==='object'?d.last:{};}return w;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const r=oldJSON.call(this,w);r.version=VERSION;if(r.worldSummary)r.worldSummary.v034f1Diagnosis= {totals:{...diag(w).totals},last:{...diag(w).last},retentionDays:1800};return r;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem('village-observer-v034f0')||localStorage.getItem('village-observer-v034e-rc5');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F1-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034F1-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 exportF1Diagnostics(w){download(`village-observer-v034F1-survival-${w.year}y.json`,report(w));},
 exportF1Trace(){if(!session.last)throw Error('먼저 60일 계측을 완료하세요.');download('village-observer-v034F1-daily-trace.json',session.last);}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const e=document.getElementById('versionBadge');if(e)e.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const oldHeader=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderHeader=function(...a){const out=oldHeader.apply(this,a),w=this.world;badge();if(typeof document==='undefined'||!w)return out;
  const prev=document.getElementById('v034f0PerfPanel');if(!prev?.parentElement)return out;
  let host=document.getElementById('v034f1Panel');if(!host){host=document.createElement('div');host.className='panel';host.id='v034f1Panel';host.innerHTML='<div class="section-head"><h2>F1 · 식량 위험 및 SIM 추적</h2><span class="tag">진단 전용</span></div><div id="v034f1Status" class="small muted"></div><div class="button-grid"><button id="v034f1ExportFood">식량 위험 JSON</button><button id="v034f1StartTrace">다음 60일 SIM 추적</button><button id="v034f1ExportTrace">SIM 추적 JSON</button></div><div class="small muted">60일 SIM 추적 중에는 계측 오버헤드가 발생합니다. 평상시 ×10 성능 기록과 구분하세요.</div>';prev.insertAdjacentElement('afterend',host);
   host.querySelector('#v034f1ExportFood').onclick=()=>NS.SaveSystem.exportF1Diagnostics(this.world);
   host.querySelector('#v034f1StartTrace').onclick=()=>{try{startTrace(this.world,60);}catch(e){alert(e.message);}};
   host.querySelector('#v034f1ExportTrace').onclick=()=>{try{NS.SaveSystem.exportF1Trace();}catch(e){alert(e.message);}};}
  const text=host.querySelector('#v034f1Status'),d=diag(w),x=session.active;if(text)text.textContent=`식량 부족 감지 ${d.totals.partialGroups}회 · 심각 ${d.totals.criticalGroups}회 · 기록 정착지/기간 ${Object.keys(d.months).length}개 · ${x?'60일 추적 중 '+x.days.length+'일':session.last?'최근 '+session.last.completedDays+'일 추적 완료':'SIM 추적 대기'}`;
  return out;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-14',title:'F1 — 기아 붕괴 진단·후기 성능 추적',summary:'F0 배급·건강 수식은 유지하고 정착지별 공급 부족과 후반 SIM 급증을 별도 기록합니다.',sections:[['생존 원인 추적',['정착지 배급 주기의 부족량과 심각 부족 빈도를 30일 단위로 제한 기록합니다.','국가 식량 총량만으로 식량 접근을 판단하지 않으며, 건강 위험 및 부족 구간을 구분합니다.']],['성능 진단',['필요할 때만 다음 60일 World 실행시간과 Snapshot 시간을 날짜별로 기록합니다.','RC5 선택형 세부 profiler도 기존 방식으로 유지하며, 계측 ON 결과는 일반 SIM/BATCH 합격 판정에 사용하지 않습니다.']],['밸런스 보존',['F1에서는 굶주림·건강·출산·물류 공식과 RNG를 바꾸지 않습니다.','150년 ×10 기준은 여전히 PC SIM/BATCH 1000ms 미만이며 F1은 목표 달성을 주장하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;badge();
try{window.villageObserver?.renderHeader?.();}catch(e){}
NS.V034F1=Object.freeze({version:VERSION,recordRation,report,startTrace,stopTrace,traceLast:()=>session.last,traceActive:()=>session.active!==null});
})(window.VSim);

;
/* H1B2 bundled source: v034f1a.js */
/* Village Observer V0.34F1A — Food Accounting Reconciliation.
 * Observe *actual* physical legacy-overflow loss; never repeat a debit.
 * Occupied tiles are assigned a canonical physical ledger in D3A observer only.
 * Food, hunger, production, military, territory, AI and RNG rules unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.34F1A',PREVIOUS='V0.34F1',KEY='village-observer-v034f1a';
const OBS=NS.V034D3A,D3=NS.V034D3,BASE=NS.V034D3A2;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const stamp=w=>Number(w.calendarOrdinalDay?.()??w.ordinalDay?.()??0);
function state(w){const s=OBS.stats(w);if(!s.f1a){s.f1a={startOrdinal:stamp(w),overflowEvents:0,overflowSpent:0,physicalOverflowTiles:0,revision:VERSION};
 // A restored F1 live 30-day bucket contains old and new observations.
 // Do not falsely certify that mixed bucket as a fully reconciled F1A period.
 if(s.live){s.live.f1aMixed=true;for(const r of Object.values(s.live.groups||{}))r.f1aMixed=true;}
 }return s.f1a;}
// This is executed ONLY on the two real legacy setter writes, not on each Person.
function captureOverflow(v,w){if(!w||!v)return null;const snap=[];for(const id of v.territory){const q=D3.stockRaw(w,id,'food');if(q>0)snap.push([Number(id),q]);}return snap;}
function recordOverflow(v,w,before){if(!before?.length||!w||!v)return 0;let spent=0,count=0;
 const x=state(w);for(const [id,was] of before){const now=D3.stockRaw(w,id,'food'),loss=was-now;
  if(loss<=1e-8)continue;
  // existing D3A observedFoodDelta already subtracts otherWithdrawn;
  // distinguish its SOURCE using an extra, non-additive diagnostic field.
  OBS.addMetric(w,v,id,'otherWithdrawn',loss);
  const row=OBS.ensureRow(w,v,id);row.legacyOverflowFoodSpent=n(row.legacyOverflowFoodSpent)+loss;
  spent+=loss;count++;
 }if(spent){x.overflowEvents++;x.overflowSpent+=spent;x.physicalOverflowTiles+=count;}return spent;
}
function enrich(w){const s=OBS.stats(w),start=n(s.f1a?.startOrdinal),rows=BASE.rows(w);
 return rows.map(r=>{
  const lost=n(r.legacyOverflowFoodSpent),era=r.windowEnd<start?'F1_LEGACY':(r.f1aMixed||r.windowStart<start?'MIXED':'F1A');
  // The base D3A window already incorporates otherWithdrawn; therefore DO NOT
  // subtract legacyOverflowFoodSpent again. It is a breakdown, not an added sink.
  const out={...r,legacyOverflowFoodSpent:lost,occupationLedgerAttributions:n(r.occupationLedgerAttributions),accountingEra:era};
  out.residualClass=(r.topologyChanged?'TOPOLOGY_CHANGE':(r.unattributedDelta==null?'NOT_COMPARABLE':Math.abs(n(r.unattributedDelta))<=.01?(n(r.occupationLedgerAttributions)>0?'OCCUPATION_LEDGER_RECONCILED':lost>0?'LEGACY_OVERFLOW_ACCOUNTED':'BALANCED'):'TRUE_UNATTRIBUTED'));
  return out;
 });
}
const esc=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const cols=[...BASE.columns,'legacyOverflowFoodSpent','occupationLedgerAttributions','accountingEra','residualClass'];
function csv(w){return [cols.join(','),...enrich(w).map(r=>cols.map(k=>esc(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(',')).join('\n')].join('\n');}
// Include legacy rows in the download with explicit provenance, but DO NOT
// relabel them as fixed. Filter anomalies from fully new windows separately.
const anomalousCols=['windowStart','windowEnd','nationName','settlementId','tileIds','accountingEra','storageDelta','observedFoodDelta','legacyOverflowFoodSpent','occupationLedgerAttributions','unattributedDelta','residualClass','topologyChanged'];
function anomalies(w,includeLegacy=false){return enrich(w).filter(r=>r.partial!=='ACTIVE'&&Math.abs(n(r.unattributedDelta))>.01&&r.unattributedDelta!=null&&(!r.topologyChanged)&& (includeLegacy||r.accountingEra==='F1A'));}
function anomalyCSV(w){return [anomalousCols.join(','),...anomalies(w).map(r=>anomalousCols.map(k=>esc(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(',')).join('\n')].join('\n');}
function report(w){const rows=enrich(w),newRows=rows.filter(r=>r.accountingEra==='F1A'&&r.partial!=='ACTIVE'&&!r.topologyChanged&&r.unattributedDelta!=null),bad=newRows.filter(r=>Math.abs(n(r.unattributedDelta))>.01);
 const s=state(w);return {version:VERSION,actualOverflowSpent:s.overflowSpent,overflowEvents:s.overflowEvents,physicalOverflowTiles:s.physicalOverflowTiles,occupationLedgerAttributions:rows.reduce((a,r)=>a+n(r.occupationLedgerAttributions),0),legacyPeriods:rows.filter(r=>r.accountingEra!=='F1A').length,observedNewPeriods:newRows.length,newAnomalies:bad.length,newNetResidual:bad.reduce((a,r)=>a+n(r.unattributedDelta),0),maxNewResidual:bad.reduce((a,r)=>Math.max(a,Math.abs(n(r.unattributedDelta))),0),foodFlowColumns:cols.length,notes:['legacyOverflowFoodSpent is an explanatory part of otherWithdrawn; never subtract twice','legacy / mixed buckets are excluded from F1A anomaly success counts','occupation-only transaction ledger identity is canonical physical Settlement; stock access rules unchanged']};}
function download(filename,content,type='text/csv;charset=utf-8'){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const oldAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){state(this);return oldAdvance.apply(this,args);};
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const r=oldSerialize.call(this);r.version=VERSION;r.v034f1a={...state(this)};return r;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브입니다.');const w=oldFrom(d.version===VERSION?{...d,version:PREVIOUS}:d);
 const s=OBS.stats(w);if(d.version===VERSION&&d.v034f1a){s.f1a={...d.v034f1a};}
 else{ // On F1/F0 import, preserve old windows as historical evidence.
  s.f1a={startOrdinal:stamp(w),overflowEvents:0,overflowSpent:0,physicalOverflowTiles:0,revision:VERSION};
  if(s.live){s.live.f1aMixed=true;for(const r of Object.values(s.live.groups||{}))r.f1aMixed=true;}
 }return w;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const r=oldJSON.call(this,w);r.version=VERSION;if(r.worldSummary)r.worldSummary.v034f1aAudit=report(w);return r;};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f1')||localStorage.getItem('village-observer-v034f0');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F1A-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034F1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportF1Diagnostics(w){const r={...NS.V034F1.report(w),version:VERSION,diagnosticsSourceVersion:'V0.34F1'};download(`village-observer-v034F1A-survival-${w.year}y.json`,JSON.stringify(r,null,2),'application/json');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034F1A-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+csv(w));},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034F1A-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+anomalyCSV(w));}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const fb=document.getElementById('exportSettlementFoodFlowD3ABtn');if(fb)fb.title='F1A 출납 52열 · 레거시 초과비축 계측 및 점령 장부 통합';}
if(NS.UI){const older=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const res=older.apply(this,args);badge();return res;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-15',title:'F1A — 식량 회계 장부 정합성 복구',summary:'실제 초과비축 차감 계측과 임시 점령 타일의 물리적 Settlement 장부 일원화. 식량·전쟁·인구·RNG 수식은 수정하지 않습니다.',sections:[['레거시 초과비축',['원래 실행되는 국가 식량 setter의 실제 재고 감소분만 otherWithdrawn에 기록합니다.','legacyOverflowFoodSpent는 otherWithdrawn의 설명용 부분집합이며 이중 차감하지 않습니다.','기존 초과비축 차감과 분기별 부패 규칙은 그대로 유지합니다.']],['임시 점령',['실제 소유 타일의 Settlement ID로 출납 관측을 귀속합니다.','적군 점령 타일에 대한 공동 재고 접근 제한은 그대로 유지합니다.','소유권·영토 양도·전투 행동에 영향이 없습니다.']],['저장/검증',['F1/F0 세이브를 불러올 수 있습니다.','구버전 및 혼합 Food Flow 기간은 F1A 교정 구간과 구분합니다.','PC ×10 150년 성능 목표는 별도의 장기 실행으로 평가해야 합니다.']]]});
NS.RELEASE_VERSION=VERSION;badge();
NS.V034F1A=Object.freeze({version:VERSION,captureOverflow,recordOverflow,report,enrich,csv,anomalies,anomalyCSV,columns:cols});
})(window.VSim);

;
/* H1B2 bundled source: v034f1a1.js */
/* Village Observer V0.34F1A1 — CSV Export and Local Parity Stabilization.
 * Absolutely no Person, food, AI, military or RNG changes.
 * Correct 52-column Food Flow / 13-column Anomaly CSV row assembly.
 */
(function(NS){'use strict';
const VERSION='V0.34F1A1',PREVIOUS='V0.34F1A',KEY='village-observer-v034f1a1';
const A=NS.V034F1A;
if(!A||!NS.World||!NS.SaveSystem)throw Error('F1A baseline missing');
const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
const ROW_COLUMNS=A.columns;
const ANOMALY_COLUMNS=['windowStart','windowEnd','nationName','settlementId','tileIds','accountingEra','storageDelta','observedFoodDelta','legacyOverflowFoodSpent','occupationLedgerAttributions','unattributedDelta','residualClass','topologyChanged'];
function asCSV(columns,rows){const lines=[columns.join(',')];for(const r of rows){lines.push(columns.map(k=>quote(k==='tileIds'?(r.tileIds||[]).join('|'):r[k])).join(','));}return lines.join('\r\n')+'\r\n';}
function foodCSV(w){return asCSV(ROW_COLUMNS,A.enrich(w));}
function anomaliesCSV(w){return asCSV(ANOMALY_COLUMNS,A.anomalies(w));}
function download(name,data,mime='text/csv;charset=utf-8'){
 const url=URL.createObjectURL(new Blob([data],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=prevSerialize.call(this);data.version=VERSION;return data;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('잘못된 세이브입니다.');return prevFrom(data.version===VERSION?{...data,version:PREVIOUS}:data);};
const prevToJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const data=prevToJSON.call(this,w);data.version=VERSION;if(data.worldSummary?.v034f1aAudit)data.worldSummary.v034f1aAudit={...data.worldSummary.v034f1aAudit,version:VERSION};return data;};
const beforeSave=NS.SaveSystem;
NS.SaveSystem={...beforeSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f1a')||localStorage.getItem('village-observer-v034f1')||localStorage.getItem('village-observer-v034f0');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034F1A1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034F1A1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportSettlementFoodFlowCSV(w){download(`village-observer-v034F1A1-foodflow-${w.telemetry.sessionId}.csv`,'\ufeff'+foodCSV(w));},
 exportFoodAnomaliesCSV(w){download(`village-observer-v034F1A1-food-anomalies-${w.telemetry.sessionId}.csv`,'\ufeff'+anomaliesCSV(w));}
};
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const el=document.getElementById('exportSettlementFoodFlowD3ABtn');if(el)el.title='F1A1 정상 52열 CSV · F1A 식량 회계 규칙 유지';}
if(NS.UI){const prevRender=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=prevRender.apply(this,args);mark();return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-15',title:'F1A1 — Food Flow CSV 출력 정상화',summary:'Food Flow 52열·이상 CSV 13열의 문자 단위 줄바꿈 회귀를 수정. F1A 식량 출납·전쟁·신진대사·RNG는 보존.',sections:[['CSV 수정',['헤더 1행과 데이터 1건당 1행을 보장합니다.','값의 쉼표·큰따옴표·줄바꿈은 RFC 4180 방식으로 이스케이프하고 CRLF를 사용합니다.','이전 F1A Food Flow 계산 및 이상 판정 기준은 변경하지 않습니다.']],['로컬 세이브 검증',['큰 세이브를 서버에 제출할 필요 없이 PC 브라우저에서 F1↔F1A1 비교 도구를 실행할 수 있습니다.','구버전 F1·F1A·F0 세이브 로드를 유지합니다.','동일 세이브와 통제된 난수로 30~180일 결과를 비교하며 150년 성능 달성과는 별개입니다.']]]});
NS.RELEASE_VERSION=VERSION;mark();
NS.V034F1A1=Object.freeze({version:VERSION,csv:foodCSV,anomalyCSV:anomaliesCSV,serializeCSV:asCSV,columns:ROW_COLUMNS,anomalyColumns:ANOMALY_COLUMNS});
})(window.VSim);

;
/* H1B2 bundled source: v034f2.js */
/* Village Observer V0.34F2 — Unified Person Lifecycle V1.
 * Three-day work cycle: all work and production -> one physical Settlement
 * ration -> exactly one individual metabolism per living Person.
 * Every calendar day: one common starvation-grace check in dailyDemography24.
 * Health/Hunger formula calibration explicitly deferred to F3.
 */
(function(NS){'use strict';
const VERSION='V0.34F2',PREVIOUS='V0.34F1A1',KEY='village-observer-v034f2';
const D3=NS.V034D3,oldMetabolism=NS.Person.prototype.metabolism,oldAct=NS.Person.prototype.act,oldDaily=NS.Village.prototype.dailyTick;
const previousDays=NS.Village.prototype.foodReserveDays,previousCritical=NS.Village.prototype.criticalFoodReserveDays,previousSettlement=NS.Village.prototype.settlementReserveDays;
const n=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b),clamp=x=>Math.max(0,Math.min(100,n(x)));
const currentWorlds=new WeakMap();
const summary=new WeakMap();
function missingHome(w){diagnostics(w).missingHomes++;}
function diagnostics(w){let d=summary.get(w);if(!d){d={completedCycles:0,aliveProcessed:0,duplicateMetabolismRequests:0,workCalls:0,fallbackMetabolism:0,woundedMetabolism:0,dailyStarvationChecks:0,graceStarts:0,graceDeaths:0,missingHomes:0};summary.set(w,d);}return d;}
function cal(w){return n(w?.calendarOrdinalDay?.()??(w?.ordinalDay?.()||0)*3);}
function need(p){return NS.V034F0.needFor(p);}
function housingAt(v,w,tid){return NS.V034D2?.housingAt?.(v,w,Number(tid))||null;}
// One physical stock numerator, one total real Person demand denominator.
// The raw source is never read twice, even in a multi-tile Settlement.
function reserveGroups(v){const w=v._world,groups=new Map();if(!w)return null;
 for(const id of v.territory||[]){const t=w.map.get(Number(id));if(!t||!eq(t.ownerId,v.id))continue;
  const sid=String(t.settlementId??('tile-'+id));let g=groups.get(sid);if(!g){g={food:0,need:0,pop:0};groups.set(sid,g);}
  if(t.v33OccupierId==null||eq(t.v33OccupierId,v.id))g.food+=n(D3.stockRaw(w,id,'food'));
 }
 for(const p of v.residents||[]){if(!p.alive)continue;const tid=Number(p.homeTileId),t=w.map.get(tid);if(!t||!eq(t.ownerId,v.id))continue;
  const sid=String(t.settlementId??('tile-'+tid)),g=groups.get(sid);if(g){g.need+=need(p);g.pop++;}
 }
 return groups;
}
NS.Village.prototype.foodReserveDays=function(){const g=reserveGroups(this);if(!g)return previousDays.call(this);let food=0,needAll=0;for(const x of g.values()){food+=x.food;needAll+=x.need;}return needAll>0?food/needAll:0;};
NS.Village.prototype.criticalFoodReserveDays=function(){const g=reserveGroups(this);if(!g)return previousCritical.call(this);let min=Infinity;for(const x of g.values())if(x.need>0)min=Math.min(min,x.food/x.need);return Number.isFinite(min)?min:0;};
NS.Village.prototype.settlementReserveDays=function(id){const w=this._world;if(!w)return previousSettlement.call(this,id);const t=w.map.get(Number(id));if(!t||!eq(t.ownerId,this.id))return 0;const m=D3.members(this,id),ids=m?.ids||[Number(id)];let food=0,want=0;const allowed=new Set(ids.map(Number));
 for(const tid of ids)food+=n(D3.stockRaw(w,tid,'food'));
 for(const p of this.residents||[])if(p.alive&&allowed.has(Number(p.homeTileId)))want+=need(p);
 return want>0?food/want:999;
};
// Collect work signals while preserving all legacy work, industry and construction.
NS.Person.prototype.metabolism=function(v,w,worked=true){const context=currentWorlds.get(w);if(!context||!eq(context.v.id,v.id))return oldMetabolism.call(this,v,w,worked);
 const d=diagnostics(w);if(context.worked.has(this)){d.duplicateMetabolismRequests++;return;}
 context.worked.set(this,!!worked);
};
NS.Person.prototype.act=function(v,w){const context=currentWorlds.get(w);if(context&&eq(context.v.id,v.id)&&this.alive){diagnostics(w).workCalls++;
  if(this.militaryStatus32A==='wounded'){this.currentAction='전상 회복 중';context.worked.set(this,false);return;}
 }
 return oldAct.call(this,v,w);
};
NS.Village.prototype.dailyTick=function(w){if(currentWorlds.has(w))throw Error('F2 nested Village dailyTick');
 const context={v:this,worked:new Map()},d=diagnostics(w);currentWorlds.set(w,context);let result;
 try{result=oldDaily.call(this,w);}finally{currentWorlds.delete(w);}
 // The entire economy/work cycle has completed. F0 prepares one pooled ration per
 // physical Settlement and applies its existing survival formula once per person.
 for(const p of this.residents||[]){if(!p.alive)continue;
  let worked=context.worked.get(p);if(worked===undefined){worked=false;d.fallbackMetabolism++;}
  oldMetabolism.call(p,this,w,worked);
  if(p.militaryStatus32A==='wounded'){p.energy=clamp(p.energy+2);p.health=clamp(p.health+.05);d.woundedMetabolism++;}
  d.aliveProcessed++;
 }
 d.completedCycles++;return result;
};
function kill(v,w,p,held){
 if(!p.alive)return;
 // Reuse canonical non-battle equipment return before filtering the dead roster.
 if(p.militaryEquipment33I1?.weaponId||p.militaryEquipment33I1?.armorId)NS.V033I1?.returnEquipment?.(v,w,p,'NONCOMBAT_DEATH');
 p.alive=false;p._v30b3Hunger100SinceCal=null;
 const st=NS.V022?.ensureNation?.(v)?.demographyStats22||v.demographyStats22;
 if(st){st.starvationDeaths=n(st.starvationDeaths)+1;if(p.age<=14)st.childDeaths=n(st.childDeaths)+1;}
 const bs=NS.V030B3?.ensureNation?.(v,w);if(bs)bs.starvationDeathsAfterGrace=n(bs.starvationDeathsAfterGrace)+1;
 w.log(`${v.name}의 ${p.name}이(가) 장기간의 극심한 굶주림으로 세상을 떠났습니다.`,true,'DEATH_STARVATION',{village:v.name,person:p.name,age:p.age,health:+n(p.health).toFixed(1),hunger:100,homeTileId:p.homeTileId,calendarDate:w.timestamp(),criticalHungerCalendarDays:held,demographyModel:'F2_UNIFIED_DAILY_12D_GRACE'});
}
function dailyStarvation(w){const today=cal(w),d=diagnostics(w);for(const v of w.activeVillages||[]){const b=NS.V030B3?.ensureNation?.(v,w);
 for(const p of v.residents||[]){if(!p.alive)continue;d.dailyStarvationChecks++;
  if(n(p.hunger)<95){p._v30b3Hunger100SinceCal=null;continue;}
  if(n(p.hunger)<100)continue;
  const start=Number(p._v30b3Hunger100SinceCal);
  if(p._v30b3Hunger100SinceCal==null||p._v30b3Hunger100SinceCal===''||!Number.isFinite(start)||start<=0){p._v30b3Hunger100SinceCal=today;d.graceStarts++;if(b)b.starvationGraceEntries=n(b.starvationGraceEntries)+1;
   w.telemetry?.record?.('STARVATION_CRITICAL_ENTER_B3',w,{village:v.name,person:p.name,age:p.age,homeTileId:p.homeTileId,hunger:100,graceCalendarDays:12,owner:'V0.34F2_DAILY'});
  }else if(today-start>=12){kill(v,w,p,today-start);d.graceDeaths++;}
 }
 }}
// Minimal persistence: daily starvation streak is already serialized per Person;
// diagnostic counters are observation-only and are allowed to reset on import.
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const x=serialize.call(this);x.version=VERSION;x.v034f2={model:'UNIFIED_LIFECYCLE_V1',calendarStarvation:true,settlementRationAfterWork:true};return x;};
NS.World.from=function(x){if(!x||typeof x!=='object')throw Error('잘못된 세이브');return from(x.version===VERSION?{...x,version:PREVIOUS}:x);};
const originalJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=originalJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034f2={model:'UNIFIED_LIFECYCLE_V1',...diagnostics(w)};return j;};
const prevSave=NS.SaveSystem;
NS.SaveSystem={...prevSave,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f1a1')||localStorage.getItem('village-observer-v034f1a');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){return download(`village-observer-v034F2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){return download(`village-observer-v034F2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');}};
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const prevRender=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=prevRender.apply(this,args);mark();return r;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-15',title:'Person Lifecycle V1 — 작업·배급·생존 판정 통합',summary:'작업 후 공동 배급, 모든 살아 있는 Person의 1회 신진대사 및 달력일 기아 판정을 통합합니다. F3 건강/Happiness 재조정은 유보합니다.',sections:[['공동 신진대사',['3일 작업주기에서 모든 직업의 작업과 생산이 끝난 다음 Settlement 공동 배급을 1회 확정합니다.','전상자·산업 노동자·Pioneer 등 정상/우회 경로 모두 같은 배급과 신진대사를 통과합니다.']],['기아·주거·비축',['12달력일 기아 사망 유예를 Person.act가 아닌 일일 인구 처리에서 판정합니다.','주거 수용량은 D2의 실제 건물 상태별 효율을 사용합니다.','국가/Settlement 식량 비축일을 물리 식량 1회 집계·실제 Person 수요 기준으로 일치시킵니다.']],['검증·범위',['기존 Food Flow 보존식과 Snapshot CSV 1683열 유지.','Hunger·Health·Happiness 변화식 대폭 수정은 차기 F3에서 논의합니다.','모델 실행 순서 변경이므로 F1A1과 RNG/인구 동일성은 요구하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034F2=Object.freeze({version:VERSION,enabled:true,dailyStarvation,housingAt,missingHome,reserveGroups,diagnostics});
mark();try{window.villageObserver?.renderHeader?.();}catch(e){}
})(window.VSim);

;
/* H1B2 bundled source: v034f3.js */
/* Village Observer V0.34F3 — Health & Happiness Lifecycle V2.
 * Keep F2 work -> ration -> metabolism -> daily starvation ordering,
 * all physical quantities and RNG feeding intact. Only continuous health
 * nutrition stress, one Happiness target and the Health-0 illness factor change.
 */
(function(NS){'use strict';
const VERSION='V0.34F3',PREVIOUS='V0.34F2',KEY='village-observer-v034f3';
const number=(x,otherwise=0)=>Number.isFinite(Number(x))?Number(x):otherwise;
const bound=(x,lo=0,hi=100)=>Math.max(lo,Math.min(hi,number(x)));
// One nutrition penalty per cycle. Immediate deficit and accumulated Hunger
// are alternative observations of starvation, not additive damage sources.
function nutritionLoss(ratio,hunger){
 const shortfall=1-bound(ratio,0,1);
 const chronic=.65*bound((number(hunger)-60)/40,0,1);
 return Math.max(shortfall,chronic);
}
// Target-only Happiness: one attractor and one update (no competing 65 target,
// underfeeding deduction or separate festival attractor). Housing strain also
// affects the single target, not another direct Happiness subtraction.
function happinessTarget(p,v,w,ratio,housingStress=0){
 const housing=bound(housingStress,0,1),shortfall=1-bound(ratio,0,1);
 const festival=v?.festivalState;
 const bonus=festival&&number(festival.until,-1)>=number(w?.ordinalDay?.(),Infinity)
   ?(Number(p.homeTileId)===Number(festival.tileId)?8:3):0;
 const prolongedHousing=number(p.housingStrainDays)>20?4*housing:0;
 return bound(54+(50-number(p.hunger))*.18+(number(p.health)-60)*.10+
   (number(p.energy)-55)*.07-8*housing-prolongedHousing-8*shortfall+bonus,15,95);
}
function updateHappiness(p,v,w,ratio,housingStress=0){
 const target=happinessTarget(p,v,w,ratio,housingStress);
 p.happinessTarget=target;
 p.happiness=bound(number(p.happiness)+(target-number(p.happiness))*.016);
 return target;
}
// Health 0 is a serious, recoverable impairment, not an instantaneous kill;
// distinguish 0 from missing/non-numeric data so the illness hazard is monotone.
function illnessHealthFactor(health){
 const h=health==null||health===''?30:number(health,30);
 return 1+Math.max(0,30-bound(h))*.012;
}
const originalSerialize=NS.World.prototype.serialize,originalFrom=NS.World.from;
NS.World.prototype.serialize=function(){const x=originalSerialize.call(this);x.version=VERSION;
 x.v034f3={model:'HEALTH_HAPPINESS_LIFECYCLE_V2',singleNutritionPenalty:true,singleHappinessTarget:true,healthZeroIllnessFixed:true};return x;};
NS.World.from=function(x){if(!x||typeof x!=='object')throw Error('잘못된 세이브');
 return originalFrom(x.version===VERSION?{...x,version:PREVIOUS}:x);};
const originalJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=originalJSON.call(this,w);j.version=VERSION;
 j.worldSummary=j.worldSummary||{};j.worldSummary.v034f3={model:'HEALTH_HAPPINESS_LIFECYCLE_V2',nutrition:'max(shortfall, 0.65*clamp((Hunger-60)/40))',happiness:'one target, rate 0.016',healthZeroIllnessFactor:1.36};return j;};
const priorSave=NS.SaveSystem;
function download(name,contents,type){const url=URL.createObjectURL(new Blob([contents],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f2')||localStorage.getItem('village-observer-v034f1a1')||localStorage.getItem('village-observer-v034f1a');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){return download(`village-observer-v034F3-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){return download(`village-observer-v034F3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');}
};
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';}
if(NS.UI){const render=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const x=render.apply(this,args);mark();return x;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'Health & Happiness Lifecycle V2 — 중복 페널티 제거',summary:'F2 생존 순서를 보존하며 건강의 영양 손실을 중복 없이 계산하고 행복도를 단일 목표값으로 통일합니다. Health=0 질병 위험 누락을 고칩니다.',sections:[['Health·Hunger',['당일 식량 부족과 누적 Hunger 영양 스트레스 중 큰 값만 건강에 적용합니다. Hunger 및 배급량 계산식은 변경하지 않습니다.','Health가 0이어도 즉사하지 않지만 질병 위험에 올바르게 반영됩니다. 기존 12일 기아 유예는 동일합니다.']],['Happiness',['기본값 65 복귀, 상황별 목표 복귀, 축제별 추가 복귀를 단일 목표값·단일 수렴식으로 통합합니다.','주거 스트레스, 식량 부족, 축제 효과를 목표값에 포함합니다.']],['검증·범위',['식량·Gold·장비 보존식, 전투·AI·연구·인구의 의사결정식 변경 없음.','F2와 수치/RNG 동일성은 요구하지 않으며, 동일 F3 환경 자체의 결정론을 점검합니다.','Health로 인한 생산 효율 감소는 도입하지 않습니다.']]]});
NS.V034F3=Object.freeze({version:VERSION,enabled:true,nutritionLoss,happinessTarget,updateHappiness,illnessHealthFactor});
NS.RELEASE_VERSION=VERSION;
mark();try{window.villageObserver?.renderHeader?.();}catch(e){}
})(window.VSim);

;
/* H1B2 bundled source: v034g1.js */
/* V0.34G1 — Tile / Settlement terminology and read-only legacy food relay audit.
 * NO changes to F3 food, Person lifecycle, AI choice, physical transfer, route or RNG.
 * Audit sampled only at the existing E2 6-calendar-day food-index cadence.
 */
(function(NS){'use strict';
const VERSION='V0.34G1',PREVIOUS='V0.34F3',KEY='village-observer-v034g1';
const data=new WeakMap(),MAX_ROWS=1200,SMALL=1e-9;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const eq=(a,b)=>String(a)===String(b);
function audit(w){let a=data.get(w);if(!a){a={indexPulses:0,indexTileRows:0,indexSettlements:0,multiTilePulses:0,duplicateTileRows:0,duplicateDonorCandidates:0,hiddenShortageTiles:0,falseDonorTiles:0,duplicateUrgentReceivers:0,sameSettlementPairs:0,sameSettlementFallbackPairs:0,pairSamples:0,shipments:0,sameSettlementShipments:0,shipmentQty:0,sameSettlementQty:0,multiTileShipmentEndpoints:0,potentialManhattanSavings:0,maxPotentialManhattanSavings:0,rows:[]};data.set(w,a);}return a;}
function short(x){return Number(n(x).toFixed(5));}
function cal(w){return Number(w?.calendarOrdinalDay?.()??0);}
function settlement(w,v,id){const t=w?.map?.get(Number(id));if(!t||!eq(t.ownerId,v.id)||t.settlementId==null||t.v33OccupierId!=null&&!eq(t.v33OccupierId,v.id))return null;return String(t.settlementId);}
function group(v,w,states){const groups=new Map();
 for(const r of states||[]){const sid=settlement(w,v,r.id)||('tile:'+r.id);let g=groups.get(sid);if(!g){g={sid,nationId:String(v.id),nationName:String(v.name),tiles:[],population:0,stock:n(r.stock),severe:0,critical:0,adults:0,donor24:0,donor30:0,urgentTiles:0,localDaysMin:Infinity,localDaysMax:0};groups.set(sid,g);}
  g.tiles.push(Number(r.id));g.population+=n(r.pop);g.severe+=n(r.severe);g.critical+=n(r.critical);g.adults+=n(r.adults);g.stock=n(r.stock);g.localDaysMin=Math.min(g.localDaysMin,n(r.days));g.localDaysMax=Math.max(g.localDaysMax,n(r.days));
  if(r.days>24&&r.stock>Math.max(8,r.pop*.36*24))g.donor24++;
  if(r.days>30&&r.stock>Math.max(8,r.pop*.36*30))g.donor30++;
  if(r.days<6||r.critical>0||r.severe>=2||(r.severe>0&&r.days<12))g.urgentTiles++;
 }
 for(const g of groups.values()){
  g.settlementDays=g.stock/Math.max(.12,g.population*.36);
  g.settlementUrgent=g.settlementDays<6||g.critical>0||g.severe>=2||(g.severe>0&&g.settlementDays<12);
  g.settlementDonor24=g.settlementDays>24&&g.stock>Math.max(8,g.population*.36*24);
  g.settlementDonor30=g.settlementDays>30&&g.stock>Math.max(8,g.population*.36*30);
 }
 return groups;
}
function append(w,entry){const a=audit(w);a.rows.push({calendarDay:cal(w),...entry});if(a.rows.length>MAX_ROWS)a.rows.splice(0,a.rows.length-MAX_ROWS);}
function observeFoodIndex(v,w,states){const a=audit(w),gs=group(v,w,states);
 a.indexPulses++;a.indexTileRows+=(states||[]).length;a.indexSettlements+=gs.size;
 for(const g of gs.values()){
  if(g.tiles.length>1)a.multiTilePulses++;
  a.duplicateTileRows+=Math.max(0,g.tiles.length-1);
  a.duplicateDonorCandidates+=Math.max(0,g.donor24-1);
  // Existing tile-based reserve can hide a Settlement-wide urgent shortage.
  if(g.settlementUrgent&&!g.urgentTiles)a.hiddenShortageTiles+=g.tiles.length;
  if(!g.settlementDonor24&&g.donor24)a.falseDonorTiles+=g.donor24;
  if(g.settlementUrgent&&g.urgentTiles>1)a.duplicateUrgentReceivers+=g.urgentTiles-1;
  // Keep samples for every multi-tile Settlement and any classification mismatch.
  if(g.tiles.length>1||g.settlementUrgent!==Boolean(g.urgentTiles)||!g.settlementDonor24&&g.donor24){
   append(w,{kind:'INDEX',nation:g.nationName,settlementId:g.sid,memberTileIds:g.tiles.join('|'),population:g.population,food:short(g.stock),settlementReserveDays:short(g.settlementDays),tileReserveDaysMin:short(g.localDaysMin),tileReserveDaysMax:short(g.localDaysMax),tileDonor24:g.donor24,settlementDonor24:Number(g.settlementDonor24),tileUrgent:g.urgentTiles,settlementUrgent:Number(g.settlementUrgent)});
  }
 }
}
function observePair(v,w,d,r,regular,z){const a=audit(w);a.pairSamples++;const s=settlement(w,v,d.id),t=settlement(w,v,r.id);
 if(s&&s===t){a.sameSettlementPairs++;if(n(regular?.capacity)<SMALL&&n(z.cap)>SMALL)a.sameSettlementFallbackPairs++;
  append(w,{kind:'SAME_SETTLEMENT_PAIR',nation:v.name,settlementId:s,fromTileId:d.id,toTileId:r.id,regularReason:regular?.reason||'',regularCapacity:n(regular?.capacity),fallbackCapacity:short(z.cap),routeCost:short(z.cost)});
 }
}
function endpointGeometry(w,v,from,to){const x=w.map?.get(Number(from)),y=w.map?.get(Number(to));if(!x||!y)return null;
 const idsFor=id=>{
  const m=NS.V034D3?.members?.(v,id);if(m?.ids?.length)return m.ids;
  const sid=settlement(w,v,id);if(sid&&v.territory){const rows=[];for(const tid of v.territory){if(settlement(w,v,tid)===sid)rows.push(Number(tid));}if(rows.length)return rows;}
  return[Number(id)];
 };
 const src=idsFor(from),dst=idsFor(to);
 const md=(a,b)=>Math.abs(n(a.x)-n(b.x))+Math.abs(n(a.y)-n(b.y));const base=md(x,y);let best=base,bestFrom=Number(from),bestTo=Number(to);
 for(const a of src){const ta=w.map?.get(a);if(!ta)continue;for(const b of dst){const tb=w.map?.get(b);if(!tb)continue;const dist=md(ta,tb);if(dist<best){best=dist;bestFrom=a;bestTo=b;}}}
 return{base,best,saving:Math.max(0,base-best),bestFrom,bestTo,actualRouteCostNotCompared:true};
}
function observeShipment(v,w,from,to,qty,routeCost){const a=audit(w);a.shipments++;a.shipmentQty+=n(qty);const s=settlement(w,v,from),t=settlement(w,v,to),same=!!s&&s===t;if(same){a.sameSettlementShipments++;a.sameSettlementQty+=n(qty);}
 const geo=endpointGeometry(w,v,from,to);if(geo&&geo.saving>0){a.multiTileShipmentEndpoints++;a.potentialManhattanSavings+=geo.saving;a.maxPotentialManhattanSavings=Math.max(a.maxPotentialManhattanSavings,geo.saving);}
 append(w,{kind:'SHIPMENT',nation:v.name,fromSettlementId:s||'',toSettlementId:t||'',fromTileId:from,toTileId:to,quantity:short(qty),legacyRouteCost:short(routeCost),sameSettlement:Number(same),legacyManhattan:geo?.base??'',bestManhattan:geo?.best??'',candidateFromTileId:geo?.bestFrom??'',candidateToTileId:geo?.bestTo??'',note:'G1 candidate is Manhattan only; no claimed road/terrain route saving'});
}
function summary(w){const a=audit(w),{rows,...counts}=a;return{...counts,shipmentQty:short(counts.shipmentQty),sameSettlementQty:short(counts.sameSettlementQty),retainedAuditRows:rows.length,retentionLimit:MAX_ROWS,observationScope:'V0.32E2 national emergency food relay decision points; geometry only for observed shipments',foodBalanceChanged:false,legacyDecisionChanged:false};}
const HEAD=['calendarDay','kind','nation','settlementId','memberTileIds','population','food','settlementReserveDays','tileReserveDaysMin','tileReserveDaysMax','tileDonor24','settlementDonor24','tileUrgent','settlementUrgent','fromSettlementId','toSettlementId','fromTileId','toTileId','regularReason','regularCapacity','fallbackCapacity','routeCost','quantity','legacyRouteCost','sameSettlement','legacyManhattan','bestManhattan','candidateFromTileId','candidateToTileId','note'];
function csv(w){const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';return[HEAD.map(quote).join(','),...audit(w).rows.map(r=>HEAD.map(k=>quote(r[k])).join(','))].join('\n');}
function filename(w){return`village-observer-v034G1-logistics-audit-${w.telemetry?.sessionId||'session'}.csv`;}
function download(name,contents,type){const url=URL.createObjectURL(new Blob([contents],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const save=NS.SaveSystem;
NS.SaveSystem={...save,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const text=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034f3')||localStorage.getItem('village-observer-v034f2')||localStorage.getItem('village-observer-v034f1a1');return text?NS.World.from(JSON.parse(text)):null;},
 export(w){download(`village-observer-v034G1-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034G1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportLogisticsAuditG1(w){download(filename(w),'\ufeff'+csv(w),'text/csv;charset=utf-8');}
};
const ser=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=ser.call(this);d.version=VERSION;d.v034g1={terminology:'Tile=타일,Settlement=정착지',audit:'read-only; counters not saved'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const toJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=toJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g1={revision:'settlement-terminology-legacy-food-relay-audit-v1',...summary(w)};return j;};
function settlementCounts(w,v){const active=w?._v34bActive;let count=0;
 if(active&&typeof active.values==='function'){for(const s of active.values())if(s?.lifecycle==='ACTIVE'&&eq(s.nationId,v.id))count++;}
 else{const seen=new Set();for(const id of v.territory||[]){const t=w?.map?.get(Number(id));if(t?.settlementId!=null)seen.add(String(t.settlementId));}count=seen.size;}
 return count;
}
function termCard(ui){const root=ui.q?.('villageContent'),v=ui.world?.selectedNation;if(!root||!v)return;let card=root.querySelector('.v034g1-terms');if(!card){card=document.createElement('div');card.className='v034g1-terms';root.insertAdjacentElement('afterbegin',card);}const tiles=v.territory?.size??v.territory?.length??0;card.textContent=`🏘 정착지 ${settlementCounts(ui.world,v)}개 · 🗺 영토 타일 ${tiles}개　|　정착지: 공동 주거·식량·경제권 / 타일: 지형·시설·군사 위치`;}
function renameTileTexts(root){if(!root)return;for(const node of root.querySelectorAll?.('.v17-settlement-detail .muted.small,.v16-jump [data-go="settlement"]')||[]){if(node.textContent?.trim()==='정착지 상세')node.textContent='타일 상세 (소속 정착지 공동 경제권)';if(node.hasAttribute?.('data-go'))node.textContent='🏘 이 타일의 개발 정보';}}
function mark(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const scope=document.getElementById('statsScope');const opt=scope?.querySelector?.('option[value="settlement"]');if(opt&&opt.textContent!=='타일 (기존 장기 통계)')opt.textContent='타일 (기존 장기 통계)';}
if(NS.UI){const hdr=NS.UI.prototype.renderHeader,rt=NS.UI.prototype.renderTile,rv=NS.UI.prototype.renderVillageContent,rs=NS.UI.prototype.renderStats;
 if(typeof hdr==='function')NS.UI.prototype.renderHeader=function(...args){const x=hdr.apply(this,args);mark();const near=document.getElementById('exportSettlementEconomyD3Btn')||document.getElementById('exportSettlementFoodFlowD3ABtn');if(near&&!document.getElementById('exportLogisticsAuditG1Btn')){const b=document.createElement('button');b.id='exportLogisticsAuditG1Btn';b.textContent='G1 물류 감사 CSV';b.title='기존 타일 수요와 정착지 수요 비교 (판단·배송 변경 없음)';b.addEventListener('click',()=>NS.SaveSystem.exportLogisticsAuditG1(this.world));near.insertAdjacentElement('afterend',b);}return x;};
 if(typeof rt==='function')NS.UI.prototype.renderTile=function(...args){const x=rt.apply(this,args),root=this.q?.('tileInspector'),t=this.world?.map?.get(this.world?.selectedTileId);if(!root||!t)return x;renameTileTexts(root);if(t.ownerId==null)return x;const economyTitle=root.querySelector?.('.v034d3-economy b');if(economyTitle)economyTitle.textContent='🌾 정착지 공동 재고';let info=root.querySelector('.v034g1-tile-label');if(!info){info=document.createElement('div');info.className='v034g1-tile-label';root.insertAdjacentElement('afterbegin',info);}const v=this.world?.villages?.find(nat=>eq(nat.id,t.ownerId)),sid=t.settlementId,member=v&&NS.V034D3?.members?.(v,t.id);info.textContent=`🗺 타일 #${t.id} · 소속 정착지 ${sid==null?'없음':sid} (${member?.ids.length||1}타일) · 국가 ${v?.name||''}`;return x;};
 if(typeof rv==='function')NS.UI.prototype.renderVillageContent=function(...args){const x=rv.apply(this,args);if(['overview','settlements','economy'].includes(this.sub)){termCard(this);if(this.sub==='settlements'){renameTileTexts(this.q?.('villageContent'));const main=this.q?.('villageContent')?.querySelector?.(':scope > h2');if(main&&main.textContent?.trim()===String(this.world.selectedNation?.name)+' 정착지')main.textContent=String(this.world.selectedNation.name)+' 영토 타일 목록';}for(const selector of ['.v034d1-summary b','.v034d2-summary b']){const t=this.q?.('villageContent')?.querySelector?.(selector);if(t)t.textContent=t.textContent.replaceAll('Settlement','정착지');}const title=this.q?.('villageContent')?.querySelector?.('.v034d3-summary b');if(title)title.textContent='🌾 D3 정착지 공동 자원·식량';}return x;};
 if(typeof rs==='function')NS.UI.prototype.renderStats=function(...args){const x=rs.apply(this,args),scope=this.q?.('statsScope'),opt=scope?.querySelector?.('option[value="settlement"]');if(opt&&opt.textContent!=='타일 (기존 장기 통계)')opt.textContent='타일 (기존 장기 통계)';const note=this.q?.('statsNote');if(note&&this.statsScope==='settlement')note.textContent='이 선택은 과거 타일별 장기 기록입니다. 다중 타일 정착지 통합 통계와 구분됩니다.';return x;};
}
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent='.v034g1-terms,.v034g1-tile-label{margin:8px 0;padding:8px 10px;border-radius:7px;background:rgba(82,128,183,.08);border:1px solid rgba(82,128,183,.28);font-size:12px;line-height:1.6}';document.head.appendChild(style);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'타일·정착지 용어 정비 및 식량 물류 감사 V1',summary:'Tile은 타일, Settlement는 공동 생활·경제권인 정착지로 통일합니다. 기존 E2 타일 기반 식량 물류 후보와 정착지 전체 수요를 비교하는 관측 전용 CSV를 추가하며 배급·AI·운송 규칙을 바꾸지 않습니다.',sections:[['용어 정비',['국가·지도에서 영토 타일 수와 정착지 수를 나누어 보여줍니다. 타일 상세는 위치·시설, 정착지는 공동 주거·식량·경제권입니다.','기존 타일별 장기통계 범위는 정착지 통합 지표와 구분하여 표시합니다.']],['기존 물류 감사',['V0.32E2 타일별 식량 수요·공급 후보와 Settlement별 합산 수요의 불일치, 동일 정착지의 운송 후보·실제 운송 여부를 관측합니다.','실제 배송 발생 시 최적 경계 진입점의 맨해튼 거리 후보만 계산합니다. 도로·지형 포함 실경로 절감은 G2 연구 대상으로 남깁니다.','정착지 수요/공급 집계는 기존 판단에 영향을 주지 않고 G1 물류 감사 CSV와 Devlog worldSummary에만 기록합니다.']],['검증·범위',['D3 공동 물리 재고·F0~F3 배급·Health·Happiness, 기존 AI·군사·RNG·경제 보존식 유지.','식량 물류의 Settlement 단위 실제 재설계 및 경계 도착 타일 선정은 G2에서 적용합니다.','감사 기록은 세이브에 포함되지 않아 일반 세이브 복귀 후 관측 카운터가 새로 시작됩니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034G1=Object.freeze({version:VERSION,enabled:true,observeFoodIndex,observePair,observeShipment,settlement,group,endpointGeometry,summary,csv,terminology:{Tile:'타일',Settlement:'정착지',Nation:'국가',Person:'주민'}});
mark();try{window.villageObserver?.renderHeader?.();}catch(e){}
})(window.VSim);

;
/* H1B2 bundled source: v034g1a.js */
/* Village Observer V0.34G1A — audit connectivity + Settlement/Tile UI split.
 * Observation only. Never change logistics, diet, AI, RNG, Person or economy state.
 */
(function(NS){'use strict';
const VERSION='V0.34G1A',PREVIOUS='V0.34G1',KEY='village-observer-v034g1a';
const MAX=1600,weak=new WeakMap(),n=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b),num=x=>Number(n(x).toFixed(5));
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=w=>Number(w?.calendarOrdinalDay?.()||0);
function audit(w){let a=weak.get(w);if(!a){a={sampleDays:0,nationSamples:0,tileSamples:0,settlementSamples:0,multiTileSamples:0,hiddenShortageSettlements:0,falseDonorSettlements:0,duplicateDonorTiles:0,duplicateUrgentTileCandidates:0,pairSamples:0,sameSettlementPairs:0,sameSettlementFallbackPairs:0,shipments:0,shipmentQty:0,sameSettlementShipments:0,sameSettlementQty:0,rows:[],lastSampleDay:-1};weak.set(w,a);}return a;}
const sid=(w,v,id)=>{const t=w.map?.get(Number(id));return t&&same(t.ownerId,v.id)&&t.settlementId!=null?String(t.settlementId):'tile:'+id;};
function push(w,row){const a=audit(w);a.rows.push({calendarDay:day(w),...row});if(a.rows.length>MAX)a.rows.splice(0,a.rows.length-MAX);}
function sample(w){if(!w||!w.map)return;const a=audit(w),date=day(w);if(a.lastSampleDay===date)return;
 a.lastSampleDay=date;a.sampleDays++;
 for(const v of w.activeVillages||[]){
  const popByTile=new Map();for(const p of v.residents||[]){if(p?.alive===false||p.homeTileId==null)continue;const id=Number(p.homeTileId);let r=popByTile.get(id);if(!r){r={pop:0,severe:0,critical:0};popByTile.set(id,r);}r.pop++;if(n(p.hunger)>=85)r.severe++;if(n(p.hunger)>=95)r.critical++;}
  const groups=new Map();for(const id0 of v.territory||[]){const id=Number(id0),r=popByTile.get(id);if(!r?.pop)continue;const stock=n(v.stockAt?.(id,'food')),days=stock/Math.max(.12,r.pop*.36),s=sid(w,v,id);let g=groups.get(s);if(!g){g={id:s,tiles:[],population:0,stock,severe:0,critical:0,legacyUrgent:0,legacyDonor:0,minDays:Infinity,maxDays:0};groups.set(s,g);}g.tiles.push(id);g.population+=r.pop;g.stock=stock;g.severe+=r.severe;g.critical+=r.critical;g.minDays=Math.min(g.minDays,days);g.maxDays=Math.max(g.maxDays,days);
    if(days<6||r.critical>0||r.severe>=2||(r.severe>0&&days<12))g.legacyUrgent++;
    if(days>24&&stock>Math.max(8,r.pop*.36*24))g.legacyDonor++;
    a.tileSamples++;
  }
  a.nationSamples++;a.settlementSamples+=groups.size;
  for(const g of groups.values()){
   const sd=g.stock/Math.max(.12,g.population*.36),urgent=sd<6||g.critical>0||g.severe>=2||(g.severe>0&&sd<12),donor=sd>24&&g.stock>Math.max(8,g.population*.36*24);
   const hidden=urgent&&!g.legacyUrgent,wrongDonor=!donor&&g.legacyDonor>0;
   if(g.tiles.length>1)a.multiTileSamples++;
   if(hidden)a.hiddenShortageSettlements++;
   if(wrongDonor)a.falseDonorSettlements++;
   a.duplicateDonorTiles+=Math.max(0,g.legacyDonor-1);a.duplicateUrgentTileCandidates+=Math.max(0,g.legacyUrgent-1);
   if(g.tiles.length>1||hidden||wrongDonor)push(w,{kind:'INDEX',nation:v.name,settlementId:g.id,memberTileIds:g.tiles.join('|'),population:g.population,sharedFood:num(g.stock),settlementReserveDays:num(sd),tileDaysMin:num(g.minDays),tileDaysMax:num(g.maxDays),legacyUrgentTiles:g.legacyUrgent,settlementUrgent:Number(urgent),legacyDonorTiles:g.legacyDonor,settlementDonor:Number(donor),hiddenShortage:Number(hidden),falseDonor:Number(wrongDonor)});
  }
 }
}
function observePair(v,w,d,r,regular,z){const a=audit(w);a.pairSamples++;const s=sid(w,v,d.id),t=sid(w,v,r.id);if(s===t){a.sameSettlementPairs++;if(n(regular?.capacity)<=0&&n(z?.cap)>0)a.sameSettlementFallbackPairs++;push(w,{kind:'SAME_SETTLEMENT_PAIR',nation:v.name,settlementId:s,fromTileId:d.id,toTileId:r.id,legacyRouteCost:num(z?.cost),regularCapacity:n(regular?.capacity),fallbackCapacity:num(z?.cap),note:regular?.reason||''});}}
function observeShipment(type,w,data){if(type!=='NATIONAL_FOOD_RELAY32D5'||!w||!data)return;const v=(w.villages||[]).find(v=>same(v.id,data.villageId));if(!v)return;const a=audit(w),s=sid(w,v,data.fromTileId),t=sid(w,v,data.toTileId),isSame=s===t,qty=n(data.qty);a.shipments++;a.shipmentQty+=qty;if(isSame){a.sameSettlementShipments++;a.sameSettlementQty+=qty;}
 const geo=NS.V034G1?.endpointGeometry?.(w,v,data.fromTileId,data.toTileId);
 push(w,{kind:'SHIPMENT',nation:v.name,fromSettlementId:s,toSettlementId:t,fromTileId:data.fromTileId,toTileId:data.toTileId,quantity:qty,legacyRouteCost:num(data.routeCost),sameSettlement:Number(isSame),legacyManhattan:geo?.base??'',bestManhattan:geo?.best??'',candidateFromTileId:geo?.bestFrom??'',candidateToTileId:geo?.bestTo??'',note:'real logistics event / geometry is Manhattan only'});
}
const advance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const ret=advance.apply(this,args);const d=day(this);if(d>0&&d%6===0&&audit(this).lastSampleDay!==d)sample(this);return ret;};
const record=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,data,...rest){const ret=record.call(this,type,w,data,...rest);if(type==='NATIONAL_FOOD_RELAY32D5')observeShipment(type,w,data);return ret;};
function summary(w){const a=audit(w),{rows,lastSampleDay,...counts}=a;return{...counts,shipmentQty:num(counts.shipmentQty),sameSettlementQty:num(counts.sameSettlementQty),retainedRows:rows.length,lastSampleDay,retentionLimit:MAX,scope:'6-day settlement comparison + actual E2 relay event + E2 pair cache-miss',simulationChanged:false};}
const HEAD=['calendarDay','kind','nation','settlementId','memberTileIds','population','sharedFood','settlementReserveDays','tileDaysMin','tileDaysMax','legacyUrgentTiles','settlementUrgent','legacyDonorTiles','settlementDonor','hiddenShortage','falseDonor','fromSettlementId','toSettlementId','fromTileId','toTileId','quantity','legacyRouteCost','sameSettlement','regularCapacity','fallbackCapacity','legacyManhattan','bestManhattan','candidateFromTileId','candidateToTileId','note'];
function csv(w){const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';return[HEAD.map(quote).join(','),...audit(w).rows.map(r=>HEAD.map(k=>quote(r[k])).join(','))].join('\n');}
function download(name,value){const url=URL.createObjectURL(new Blob(['\ufeff',value],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const saved=NS.SaveSystem;
NS.SaveSystem={...saved,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const text=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3')||localStorage.getItem('village-observer-v034f2');return text?NS.World.from(JSON.parse(text)):null;},
 export(w){const d=JSON.stringify(w.serialize()),url=URL.createObjectURL(new Blob([d],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=`village-observer-v034G1A-save-${w.year}y.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 exportDevJSON(w){const d=JSON.stringify(w.telemetry.toJSON(w)),url=URL.createObjectURL(new Blob([d],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=`village-observer-v034G1A-devlog-${w.telemetry.sessionId}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 exportLogisticsAuditG1(w){download(`village-observer-v034G1A-logistics-audit-${w.telemetry?.sessionId||'session'}.csv`,csv(w));}
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g1a={audit:'transient observation',ui:'nation settlement/tile tabs'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const originalJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=originalJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g1a=summary(w);return j;};
function groupsForUI(v,w){const rows=NS.V034D2?.context?.(v,w)||[],seen=new Set();return rows.filter(r=>{const id=String(r.settlementId);if(seen.has(id))return false;seen.add(id);return true;}).sort((a,b)=>n(b.population)-n(a.population)||n(a.coreTileId)-n(b.coreTileId));}
function renderGroups(ui,root,v){const w=ui.world,groups=groupsForUI(v,w),open=ui._g1aOpen||new Set();const html=groups.map(g=>{const anchor=Number(g.coreTileId??g.tileIds[0]),ids=(g.tileIds||[]).map(Number),r=(resource)=>n(v.stockAt?.(anchor,resource)),days=n(v.settlementReserveDays?.(anchor));const center=w.map.get(anchor);const structures=ids.reduce((s,id)=>s+(w.map.get(id)?.buildings?.length||0),0);const title=`정착지 ${escape(g.settlementId)}`;
 return `<details class="v034g1a-settlement-card" data-g1a-sid="${escape(g.settlementId)}" ${open.has(String(g.settlementId))?'open':''}><summary><span><strong>🏘 ${title}</strong><small>${center?`중심 (${center.x},${center.y}) · `:''}${ids.length}타일 · ${g.population}명</small></span><span class="v034g1a-tag">${days.toFixed(1)}주기 ▾</span></summary><div class="v034g1a-grid"><div>👥 인구 <b>${g.population}명</b></div><div>🏠 공동 주거 <b>${n(g.capacity).toFixed(1)}명분</b></div><div>🌾 공동 식량 <b>${r('food').toFixed(1)}</b></div><div>📦 비축 <b>${days.toFixed(1)}주기</b></div><div>🪵 목재 <b>${r('wood').toFixed(1)}</b></div><div>🪨 석재 <b>${r('stone').toFixed(1)}</b></div><div>🏗 건물 <b>${structures}개</b></div><div>🏘 주거 부족 <b>${n(g.shortage).toFixed(1)}명분</b></div></div><div class="v034g1a-members"><span>구성 타일</span>${ids.map(id=>{const t=w.map.get(id);return `<button type="button" data-g1a-tile="${id}" title="타일 탭에서 자세히 보기">#${id} (${t?.x??'?'},${t?.y??'?'})</button>`;}).join('')}</div><button type="button" class="v034g1a-jump" data-g1a-map="${anchor}">📍 중심 타일 지도에서 보기</button></details>`;}).join('');
 root.innerHTML=`<div class="v034g1a-top"><h2>${escape(v.name)} · 정착지</h2><div class="small muted">정착지 ${groups.length}개 · 영토 타일 ${v.territory.size}개</div></div><div class="v034g1a-list">${html||'<p class="muted">표시할 정착지가 없습니다.</p>'}</div>`;
 root.querySelectorAll('details[data-g1a-sid]').forEach(el=>el.addEventListener('toggle',()=>{const id=el.dataset.g1aSid;if(el.open)open.add(id);else open.delete(id);}));ui._g1aOpen=open;
 root.querySelectorAll('[data-g1a-tile]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.g1aTile);ui._g1aMode='tiles';ui.world.selectedTileId=id;ui.selectedSettlementDetailId=id;ui.renderVillageContent();});
 root.querySelectorAll('[data-g1a-map]').forEach(b=>b.onclick=()=>{ui.world.selectedTileId=Number(b.dataset.g1aMap);ui.view='map';ui.renderViews();});
}
function tabBar(ui,root){const mode=ui._g1aMode==='tiles'?'tiles':'settlements';const wrap=document.createElement('div');wrap.className='v034g1a-switch';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','국가 영역 보기');wrap.innerHTML=`<button type="button" data-g1a-mode="settlements" class="${mode==='settlements'?'active':''}">🏘 정착지</button><button type="button" data-g1a-mode="tiles" class="${mode==='tiles'?'active':''}">🗺 타일</button>`;root.insertAdjacentElement('afterbegin',wrap);wrap.querySelectorAll('button').forEach(b=>b.onclick=()=>{ui._g1aMode=b.dataset.g1aMode;ui.renderVillageContent();});}
if(NS.UI){const content=NS.UI.prototype.renderVillageContent,header=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderVillageContent=function(...args){const root=this.q?.('villageContent'),priorScroll=root?.scrollTop||0;const prevOpen=root?.querySelectorAll?.('details[data-g1a-sid]');if(prevOpen){this._g1aOpen=this._g1aOpen||new Set();prevOpen.forEach(d=>{if(d.open)this._g1aOpen.add(d.dataset.g1aSid);else this._g1aOpen.delete(d.dataset.g1aSid);});}
  const result=content.apply(this,args);const v=this.world?.selectedNation,host=this.q?.('villageContent');if(this.sub!=='settlements'||!host||!v)return result;
  if(this._g1aMode!=='tiles')renderGroups(this,host,v);
  tabBar(this,host);host.scrollTop=priorScroll;return result;};
 NS.UI.prototype.renderHeader=function(...args){const r=header.apply(this,args);const btn=document.getElementById('exportLogisticsAuditG1Btn');if(btn){btn.textContent='G1A 물류 감사 CSV';btn.title='6일 간격 독립 정착지 감사 + 실제 물류 이벤트';}document.title='Village Observer '+VERSION;const v=document.getElementById('versionBadge');if(v)v.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
}
if(typeof document!=='undefined'){const s=document.createElement('style');s.textContent=`.v034g1a-switch{display:flex;gap:6px;margin:8px 0 14px;position:sticky;top:0;z-index:2;background:var(--bg,#131c27);padding:5px;border-radius:9px}.v034g1a-switch button{flex:1;padding:9px;border-radius:8px;cursor:pointer}.v034g1a-switch button.active{border:1px solid #5b9fc6;background:rgba(91,159,198,.22);font-weight:700}.v034g1a-list{display:grid;gap:10px}.v034g1a-settlement-card{border:1px solid rgba(125,158,184,.35);border-radius:10px;padding:10px;background:rgba(90,134,165,.07)}.v034g1a-settlement-card summary{display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer;list-style:none}.v034g1a-settlement-card summary::-webkit-details-marker{display:none}.v034g1a-settlement-card summary span{display:flex;flex-direction:column;gap:3px}.v034g1a-settlement-card summary small{opacity:.72}.v034g1a-settlement-card summary .v034g1a-tag{font-size:12px;white-space:nowrap;opacity:.75}.v034g1a-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:12px 0}.v034g1a-grid>div{background:rgba(101,134,164,.10);border-radius:6px;padding:8px;font-size:12px;display:flex;flex-direction:column;gap:3px}.v034g1a-members{display:flex;flex-wrap:wrap;align-items:center;gap:5px;padding:7px 0}.v034g1a-members span{font-size:12px;opacity:.7;margin-right:5px}.v034g1a-members button,.v034g1a-jump{cursor:pointer;border:1px solid rgba(115,147,182,.35);border-radius:7px;padding:6px;font-size:12px}.v034g1a-jump{margin-top:9px}.v034g1a-top{margin-bottom:10px}`;document.head.appendChild(s);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'정착지 카드·타일 탭 분리 및 식량 물류 감사 연결 안정화',summary:'국가 정착지 탭을 실제 정착지별 카드로 바꾸고 타일 상세를 별도 하위 탭에서 유지합니다. E2 물류 감사가 빈 파일로 끝나지 않도록 6일 정착지 샘플과 실제 운송 이벤트를 독립 계측합니다.',sections:[['국가 UI',['정착지별 공동 인구·주거·식량·자원 카드 및 구성 타일 버튼','정착지/타일 하위 탭 분리, 기존 타일 상세·지도 클릭 유지']],['감사',['6일마다 정착지 전체와 타일별 기존 비축 판단을 비교합니다.','실제 NATIONAL_FOOD_RELAY32D5 이벤트에서 배송 건수와 동일 정착지 배송 여부를 독립 기록합니다.','CSV 및 Devlog 요약은 G1A 전용으로 제공하며 감사 데이터는 세이브에 포함하지 않습니다.']],['변경하지 않은 것',['실제 물류·AI·F3 배급·RNG·전쟁·Gold·재고 보존식 미변경','최적 도로 경로와 정착지 수요 통합은 G2에서 처리']]]});
NS.V034G1A=Object.freeze({version:VERSION,summary,csv,sample,observePair,observeShipment,groupsForUI});NS.RELEASE_VERSION=VERSION;
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);

;
/* H1B2 bundled source: v034g1b.js */
/* Village Observer V0.34G1B — settlement-first nation UI; read-only observation.
 * No economy, logistics, AI, Person, RNG, or protected legacy source changes.
 */
(function(NS){'use strict';
const VERSION='V0.34G1B',PREVIOUS='V0.34G1A',KEY='village-observer-v034g1b';
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=(x,d=1)=>n(x).toFixed(d);
const pct=(part,total)=>Math.max(0,Math.min(100,total>0?100*n(part)/n(total):0));
const eq=(a,b)=>String(a)===String(b);
const RES=[['food','🌾','식량'],['wood','🪵','목재'],['stone','🪨','석재'],['iron_ore','⛏','철광'],['iron','🔩','철'],['tools','🔧','도구']];
const buildingIcon=b=>NS.BUILDINGS?.[b]?.icon||'▣';
const buildingLabel=b=>NS.BUILDINGS?.[b]?.label||b;
const terrain=t=>NS.TERRAIN?.[t?.terrain]?.label||String(t?.terrain||'미상');
const bar=(value,maximum)=>`<div class="v034g1b-bar"><span style="width:${pct(value,maximum).toFixed(2)}%"></span></div>`;
function dataFor(v,w){
 const gs=NS.V034G1A.groupsForUI(v,w),personByTile=new Map(),personByGroup=new Map();
 const byTile=new Map();for(const g of gs)for(const tid of g.tileIds||[])byTile.set(Number(tid),String(g.settlementId));
 for(const p of v.residents||[]){if(p.alive===false)continue;const tid=Number(p.homeTileId),sid=byTile.get(tid);if(!sid)continue;
  let a=personByGroup.get(sid);if(!a){a={count:0,age:0,health:0,happiness:0,hunger:0,severe:0,critical:0,jobs:new Map()};personByGroup.set(sid,a);}a.count++;a.age+=n(p.age);a.health+=n(p.health);a.happiness+=n(p.happiness);a.hunger+=n(p.hunger);if(n(p.hunger)>=85)a.severe++;if(n(p.hunger)>=95)a.critical++;const j=String(p.job||'미배정');a.jobs.set(j,(a.jobs.get(j)||0)+1);personByTile.set(tid,(personByTile.get(tid)||0)+1);
 }
 return{groups:gs,people:personByGroup,byTile,personByTile};
}
function groupData(v,w,g,people){
 const ids=(g.tileIds||[]).map(Number),centerId=Number(g.coreTileId??ids[0]);const tiles=ids.map(id=>w.map.get(id)).filter(Boolean);
 const raw=k=>Math.max(0,n(v.stockAt?.(centerId,k)));const stock=Object.fromEntries(RES.map(([k])=>[k,raw(k)]));
 const sharedCaps=v.settlementCaps?.(centerId)||{};const capacity=Object.fromEntries(RES.map(([k])=>[k,Math.max(0,n(sharedCaps[k]))]));
 const counts=new Map(),condition=[],cityNames=new Map(),urbScores=[],usedTiles=new Set();
 for(const t of tiles){usedTiles.add(Number(t.id));(t.buildings||[]).forEach((b,i)=>{counts.set(b,(counts.get(b)||0)+1);condition.push(n(t.buildingCondition?.[i]??100));});}
 // V28 tile urbanity is a historical tile-scoped statistic, not a settlement value.
 // Show a derived tile-population-weighted figure only when existing cached rows are present.
 const source=v._v28Summary?.data?.rows||[];for(const r of source){if(!usedTiles.has(Number(r.id)))continue;urbScores.push({val:n(r.urbanity),pop:Math.max(1,n(r.pop))});if(r.rank)cityNames.set(r.rank,(cityNames.get(r.rank)||0)+1);}
 const urban=urbScores.length?urbScores.reduce((s,r)=>s+r.val*r.pop,0)/urbScores.reduce((s,r)=>s+r.pop,0):null;
 return{ids,tiles,centerId,stock,capacity,counts,buildCondition:condition.length?condition.reduce((a,b)=>a+b,0)/condition.length:null,people:people||{count:0,age:0,health:0,happiness:0,hunger:0,severe:0,critical:0,jobs:new Map()},urban,cityNames};
}
function drawResources(d){return RES.map(([k,ico,label])=>{
 const cap=d.capacity[k],val=d.stock[k];return`<div class="v034g1b-resource" title="정착지 전체 물리 재고 합계 / 구성 타일 저장 용량 합계"><span>${ico} ${label}</span>${bar(val,cap)}<span class="v034g1b-res-val">${f(val,0)} / ${f(cap,0)}</span></div>`;
 }).join('');}
function drawBuildings(d){const entries=[...d.counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));return entries.length?entries.map(([b,c])=>`<span class="v034g1b-building">${esc(buildingIcon(b))} ${esc(buildingLabel(b))} <strong>×${c}</strong></span>`).join(''):'<span class="v034g1b-note">건물 없음</span>';}
function settlementCard(v,w,g,ps,open){
 const d=groupData(v,w,g,ps),t=w.map.get(d.centerId),p=d.people,actualPop=n(g.population),cap=n(g.capacity),reserve=n(v.settlementReserveDays?.(d.centerId)),critical=p.critical||0;
 const buildingTotal=[...d.counts.values()].reduce((a,b)=>a+b,0);
 const jobList=[...p.jobs.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([job,c])=>`${esc(job)} ${c}`).join(' · ');
 const urgent=critical>0||reserve<6;
 return `<article class="v034g1b-settlement ${urgent?'v034g1b-urgent':''}" data-g1b-sid="${esc(g.settlementId)}">
  <header><div><h3>🏘 정착지 ${esc(g.settlementId)}</h3><div class="v034g1b-sub">중심 (${t?.x??'?'},${t?.y??'?'}) · ${d.ids.length}타일 · ${buildingTotal}개 건물</div></div><div class="v034g1b-reserve" title="현재 F2 주민 구성별 3일 배급 요구량 기준">🌾 ${f(reserve)} <small>작업주기</small></div></header>
  <div class="v034g1b-pop"><div class="v034g1b-pop-label"><strong>👥 ${actualPop}명</strong><span>공동 주거 ${f(cap,0)}명분${g.shortage>0?' · 부족 '+f(g.shortage,1):''}</span></div>${bar(actualPop,cap)}
    <div class="v034g1b-pop-meta">평균 건강 ${p.count?f(p.health/p.count,0):'—'} · 행복 ${p.count?f(p.happiness/p.count,0):'—'} · Hunger ${p.count?f(p.hunger/p.count,0):'—'}${p.severe?' · 심한 Hunger '+p.severe+'명':''}</div></div>
  <div class="v034g1b-overview"><span><b>주거</b> ${f(pct(actualPop,cap),0)}%</span><span><b>도시화</b> ${d.urban==null?'미집계':f(d.urban,0)+'/100'}</span><span><b>평균 연령</b> ${p.count?f(p.age/p.count):'—'}세</span><span><b>평균 시설 상태</b> ${d.buildCondition==null?'—':f(d.buildCondition,0)+'%'}</span></div>
  <div class="v034g1b-resources">${drawResources(d)}</div>
  <div class="v034g1b-buildings"><div class="v034g1b-section-title">🏗 시설 · ${buildingTotal}개</div><div class="v034g1b-building-list">${drawBuildings(d)}</div></div>
  <div class="v034g1b-jobs"><b>직업 구성</b> <span>${jobList||'거주 주민 없음'}</span></div>
  <div class="v034g1b-action"><button type="button" data-g1b-expand="${esc(g.settlementId)}">${open?'구성 타일 접기 ▴':'구성 타일 보기 ▾'}</button><button type="button" data-g1b-center="${d.centerId}">📍 지도에서 보기</button></div>
  ${open?`<div class="v034g1b-member-list">${d.tiles.map(t=>`<button type="button" data-g1b-member="${t.id}">#${t.id} (${t.x},${t.y}) · ${esc(terrain(t))}</button>`).join('')}</div>`:''}
 </article>`;
}
function tileDetail(v,w,t){const cap=Object.fromEntries(RES.map(([k])=>[k,n(NS.V034D3?.physicalCap?.(v,t.id,k))])),raw=k=>n(NS.V034D3?.stockRaw?.(w,t.id,k)??t.stocks?.[k]);return `<div class="v034g1b-tile-detail"><div class="v034g1b-section-title">개별 타일 정보 · 공동 정착지 재고가 아닌 실제 위치별 재고</div>
  <div class="v034g1b-physical">${RES.map(([k,ico,label])=>`<span>${ico} ${label} ${f(raw(k),1)} / ${f(cap[k],1)}</span>`).join('')}</div>
  <div class="v034g1b-building-list">${(t.buildings||[]).map(b=>`<span class="v034g1b-building">${esc(buildingIcon(b))} ${esc(buildingLabel(b))}</span>`).join('')||'시설 없음'}</div>
  <button type="button" data-g1b-center="${t.id}">📍 지도에서 타일 상세 보기</button></div>`;}
function render(ui){const w=ui.world,v=w?.selectedNation,root=ui.q?.('villageContent');if(!w||!v||!root)return;
 const switcher=root.querySelector('.v034g1a-switch');const mode=ui._g1aMode==='tiles'?'tiles':'settlements';const model=dataFor(v,w),expanded=ui._g1bExpanded||(ui._g1bExpanded=new Set());
 let html='';if(mode==='settlements'){
  html=`<div class="v034g1b-heading"><strong>${esc(v.name)} · 정착지</strong><span>정착지 ${model.groups.length}개 · 영토 ${v.territory.size}타일</span></div><div class="v034g1b-cards">${model.groups.map(g=>settlementCard(v,w,g,model.people.get(String(g.settlementId)),expanded.has(String(g.settlementId)))).join('')}</div>`;
 }else{
  const tiles=[...v.territory].map(id=>w.map.get(Number(id))).filter(Boolean).sort((a,b)=>n(model.personByTile.get(b.id))-n(model.personByTile.get(a.id))||a.id-b.id),sel=ui._g1bTileOpen;
  html=`<div class="v034g1b-heading"><strong>${esc(v.name)} · 타일</strong><span>${tiles.length}타일 · 선택하여 상세 보기</span></div><div class="v034g1b-tiles">${tiles.map(t=>{const selected=Number(sel)===t.id,pop=n(model.personByTile.get(t.id)),bid=(t.buildings||[]).length;return `<section class="v034g1b-tile-row ${selected?'is-selected':''}"><button type="button" class="v034g1b-tile-button" data-g1b-tile="${t.id}" aria-expanded="${selected}"><span class="v034g1b-tile-main">${t.id===v.coreTileId?'🏛':'▣'} <b>#${t.id}</b> (${t.x},${t.y}) · ${esc(terrain(t))}<small>정착지 ${esc(model.byTile.get(t.id)||'미배정')}</small></span><span class="v034g1b-tile-metrics">👥 ${pop} · 🏗 ${bid} ${selected?'▴':'▾'}</span></button>${selected?tileDetail(v,w,t):''}</section>`;}).join('')}</div>`;
 }
 // Preserve G1A's working mode switch, but replace previous dense/compact list contents.
 const scroll=root.scrollTop,bar=switcher?.cloneNode(true);root.innerHTML='';if(bar){root.appendChild(bar);bar.querySelectorAll('[data-g1a-mode]').forEach(b=>b.addEventListener('click',()=>{ui._g1aMode=b.dataset.g1aMode;ui._g1bTileOpen=null;ui.renderVillageContent();}));}
 const host=document.createElement('div');host.className='v034g1b-root';host.innerHTML=html;root.appendChild(host);root.scrollTop=scroll;
 root.querySelectorAll('[data-g1b-expand]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.g1bExpand;expanded.has(id)?expanded.delete(id):expanded.add(id);ui.renderVillageContent();}));
 root.querySelectorAll('[data-g1b-member]').forEach(b=>b.addEventListener('click',()=>{ui._g1aMode='tiles';ui._g1bTileOpen=Number(b.dataset.g1bMember);ui.world.selectedTileId=ui._g1bTileOpen;root.scrollTop=0;ui.renderVillageContent();const row=root.querySelector('.is-selected');row?.scrollIntoView({block:'nearest'});}));
 root.querySelectorAll('[data-g1b-tile]').forEach(b=>b.addEventListener('click',()=>{const id=Number(b.dataset.g1bTile);ui._g1bTileOpen=ui._g1bTileOpen===id?null:id;ui.world.selectedTileId=id;ui.renderVillageContent();}));
 root.querySelectorAll('[data-g1b-center]').forEach(b=>b.addEventListener('click',()=>{ui.world.selectedTileId=Number(b.dataset.g1bCenter);ui.view='map';ui.renderViews();}));
}
const priorSave=NS.SaveSystem;
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const s=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g1a')||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3')||localStorage.getItem('village-observer-v034f2');return s?NS.World.from(JSON.parse(s)):null;},
 export(w){const data=JSON.stringify(w.serialize()),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`village-observer-v034G1B-save-${w.year}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 exportDevJSON(w){const data=JSON.stringify(w.telemetry.toJSON(w)),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`village-observer-v034G1B-devlog-${w.telemetry.sessionId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g1b={ui:'settlement-detail/tile-compact',simulationChanged:false};return d;};
NS.World.from=function(data){if(!data||typeof data!=='object')throw Error('잘못된 세이브');return from(data.version===VERSION?{...data,version:PREVIOUS}:data);};
const toJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=toJSON.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g1b={ui:'settlement-detail/tile-compact',simulationChanged:false};return j;};
if(NS.UI){const old=NS.UI.prototype.renderVillageContent,head=NS.UI.prototype.renderHeader;
 NS.UI.prototype.renderVillageContent=function(...args){const result=old.apply(this,args);if(this.sub==='settlements')render(this);return result;};
 NS.UI.prototype.renderHeader=function(...args){const r=head.apply(this,args);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b)b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';return r;};
}
if(typeof document!=='undefined'){
 const s=document.createElement('style');s.textContent=`
 .v034g1b-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin:12px 0}.v034g1b-heading>strong{font-size:17px}.v034g1b-heading>span{font-size:12px;opacity:.72}
 .v034g1b-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v034g1b-settlement{border:1px solid rgba(115,148,177,.38);border-radius:12px;background:rgba(17,34,51,.39);padding:12px;min-width:0}.v034g1b-settlement.v034g1b-urgent{border-left:3px solid #e8a750}
 .v034g1b-settlement>header{display:flex;justify-content:space-between;gap:6px;align-items:flex-start;margin-bottom:8px}.v034g1b-settlement h3{font-size:14px;line-height:1.25;margin:0 0 4px;font-weight:700}.v034g1b-sub{font-size:11px;opacity:.7}.v034g1b-reserve{font-size:13px;white-space:nowrap;color:#b6d7f0;font-weight:700}.v034g1b-reserve small{font-size:10px;font-weight:400;opacity:.75}
 .v034g1b-pop{border:1px solid rgba(92,143,192,.32);border-radius:9px;padding:9px;background:rgba(52,110,161,.13)}.v034g1b-pop-label{display:flex;justify-content:space-between;font-size:12px;gap:8px}.v034g1b-pop-label span{opacity:.78}.v034g1b-bar{height:7px;min-width:15px;flex:1;border-radius:6px;background:rgba(130,170,205,.15);overflow:hidden}.v034g1b-bar>span{height:100%;display:block;background:#70b3ef;border-radius:6px}.v034g1b-pop>.v034g1b-bar{margin-top:7px}.v034g1b-pop-meta{font-size:11px;line-height:1.45;margin-top:6px;opacity:.78}
 .v034g1b-overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;font-size:11px;margin:8px 0}.v034g1b-overview>span{border-radius:5px;background:rgba(107,143,175,.11);padding:5px}.v034g1b-overview b{font-weight:600}
 .v034g1b-resources{display:grid;gap:4px;margin:8px 0}.v034g1b-resource{display:flex;align-items:center;gap:7px;font-size:11px}.v034g1b-resource>span:first-child{width:57px;flex:none}.v034g1b-resource .v034g1b-bar{height:6px}.v034g1b-res-val{width:81px;text-align:right;flex:none;white-space:nowrap;opacity:.8}
 .v034g1b-section-title{font-size:11px;font-weight:700;margin-bottom:6px}.v034g1b-building-list{display:flex;flex-wrap:wrap;gap:5px}.v034g1b-building{font-size:10px;border-radius:100px;border:1px solid rgba(123,159,189,.4);padding:4px 7px;white-space:nowrap}.v034g1b-note{font-size:11px;opacity:.62}.v034g1b-buildings{margin-top:8px}.v034g1b-jobs{display:flex;gap:6px;font-size:11px;line-height:1.5;margin-top:9px}.v034g1b-jobs span{opacity:.77}
 .v034g1b-action{display:flex;gap:7px;justify-content:space-between;margin-top:9px}.v034g1b-action button,.v034g1b-member-list button,.v034g1b-tile-detail button{font-size:11px;border-radius:7px;padding:6px 8px;cursor:pointer;border:1px solid rgba(105,147,190,.40)}.v034g1b-member-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
 .v034g1b-tiles{display:grid;gap:6px}.v034g1b-tile-row{border:1px solid rgba(121,161,192,.35);border-radius:9px;overflow:hidden;background:rgba(104,141,179,.06)}.v034g1b-tile-row.is-selected{border-color:#74b7ef}.v034g1b-tile-button{display:flex;justify-content:space-between;align-items:center;gap:8px;cursor:pointer;width:100%;padding:9px 12px;text-align:left;background:transparent;border:0;color:inherit}.v034g1b-tile-main{font-size:12px;line-height:1.45}.v034g1b-tile-main small{display:block;opacity:.65}.v034g1b-tile-metrics{font-size:11px;opacity:.76;white-space:nowrap}.v034g1b-tile-detail{padding:12px;border-top:1px solid rgba(121,161,192,.32)}.v034g1b-physical{display:flex;flex-wrap:wrap;gap:8px;font-size:11px;margin-bottom:9px}.v034g1b-physical>span{padding:4px 6px;border-radius:5px;background:rgba(101,143,184,.11)}.v034g1b-tile-detail button{margin-top:10px}
 @media(max-width:730px){.v034g1b-cards{grid-template-columns:1fr}.v034g1b-settlement{padding:9px}.v034g1b-res-val{width:76px}.v034g1b-overview{grid-template-columns:repeat(2,minmax(0,1fr))}}
 `;document.head.appendChild(s);
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-16',title:'정착지 상세 카드 · 타일 간결 목록',summary:'국가 정보에서 공동 경제와 인구·주거·시설을 정착지 상세 카드에 모으고, 타일은 선택형 간결 목록으로 전환합니다. 식량 비축 표시는 F2의 3일 작업주기 단위를 통일합니다.',sections:[['정착지 중심 화면',['실제 Settlement별 2열 카드(모바일 1열)에서 공동 재고, 주거, 평균 건강·행복, 건물 구성과 주민 직업을 바로 확인할 수 있습니다.','구성 타일은 필요할 때만 펼쳐보고 지도 상세로 이동합니다.']],['타일 탐색',['많은 타일을 빠르게 훑을 수 있는 압축 목록으로 전환합니다.','타일을 클릭하면 해당 타일의 물리 재고·건물만 펼쳐 보여 줍니다.']],['표시 정합성',['F2 식량 비축값을 작업주기(3일)로 명시하고 개별 타일의 공동 비축값 반복을 제거합니다.','공동 재고와 개별 타일의 실제 물리 재고를 구분 표시합니다.']],['비변경 범위',['G1A 물류 감사·F3 대사·RNG·경제·AI·군사·도로·공간 통합 규칙은 유지됩니다.','G2 정착지 단위 물류 알고리즘과 G3 원형 반경 확장은 아직 적용되지 않았습니다.']]]});
NS.V034G1B=Object.freeze({version:VERSION,dataFor,groupData});NS.RELEASE_VERSION=VERSION;
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);

;
/* H1B2 bundled source: v034g2.js */
/* V0.34G2 Settlement Logistics V2 — unified same-nation food relief.
 * A Settlement owns exactly one food demand and one physical pool. Inter-Settlement
 * delivery chooses a legal reachable tile pair using the real route cost. No RNG.
 * Legacy V27/V28/E2 food relief is retained only as a pre-bootstrap fallback.
 */
(function(NS){'use strict';
const VERSION='V0.34G2',PREVIOUS='V0.34G1B',KEY='village-observer-v034g2';
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b);
const cal=w=>num(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
const n5=x=>+num(x).toFixed(5);
const diag=new WeakMap();
function stats(w){let s=diag.get(w);if(!s){s={pulses:0,nationPulses:0,settlementReads:0,receivers:0,donorCandidates:0,skippedSameSettlement:0,routePairsChecked:0,routePairsReachable:0,routeCacheHits:0,blocked:{},shipments:0,quantity:0,returned:0,failedReturns:0,invalidEndpoints:0,physicalMismatch:0,foodDemand:0,hiddenLegacyShortages:0,retainedRoutes:[],lastDay:-1};diag.set(w,s);}return s;}
const block=(s,k)=>s.blocked[k]=(s.blocked[k]||0)+1;
function tileOK(w,v,tid){const t=w.map?.get(Number(tid));return !!(t&&same(t.ownerId,v.id)&&!(t.v33OccupierId!=null&&!same(t.v33OccupierId,v.id)));}
function groups(v,w){
 const g=new Map(),byTile=new Map(),territory=Array.from(v.territory||[],Number).sort((a,b)=>a-b);
 for(const id of territory){if(!tileOK(w,v,id))continue;const t=w.map.get(id),sid=t.settlementId!=null?String(t.settlementId):'tile:'+id;
  let x=g.get(sid);if(!x){x={sid,ids:[],anchor:id,pop:0,adults:0,tileAdults:new Map(),severe:0,critical:0,hunger:0,need:0,stock:0,days:0,avgHunger:0,room:0};g.set(sid,x);}
  x.ids.push(id);byTile.set(id,x);x.stock+=num(NS.V034D3?.stockRaw?.(w,id,'food')??t.stocks?.food);
  x.room+=Math.max(0,num(NS.V034D3?.physicalCap?.(v,id,'food'))-num(NS.V034D3?.stockRaw?.(w,id,'food')??t.stocks?.food));
 }
 for(const p of v.residents||[]){if(p.alive===false)continue;const x=byTile.get(Number(p.homeTileId));if(!x)continue;
  x.pop++;x.need+=num(NS.V034F0?.needFor?.(p)??(num(p.age)<15?.30:.42));x.hunger+=num(p.hunger);
  if(num(p.hunger)>=85)x.severe++;if(num(p.hunger)>=95)x.critical++;
  if(num(p.age)>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'){x.adults++;const tid=Number(p.homeTileId);x.tileAdults.set(tid,(x.tileAdults.get(tid)||0)+1);}
 }
 for(const x of g.values()){x.avgHunger=x.pop?x.hunger/x.pop:0;x.days=x.pop?x.stock/Math.max(.12,x.need):999;}
 return [...g.values()].filter(x=>x.pop>0).sort((a,b)=>a.anchor-b.anchor);
}
const demandUrgent=x=>x.days<(x.pop>=4?18:10)||x.critical>0||x.severe>0||x.avgHunger>=58;
const donorOK=(x,floor)=>x.days>floor&&x.stock>Math.max(8,x.need*floor);
const manhattan=(w,a,b)=>{const x=w.map.get(a),y=w.map.get(b);return Math.abs(num(x?.x)-num(y?.x))+Math.abs(num(x?.y)-num(y?.y));};
function routeCost(v,w,from,to){
 const first=v.internalPathCost?.(from,to);let cost=first==null?Infinity:Number(first);
 if(!Number.isFinite(cost)){const raw=w.map.tradePathCost?.([from],[to],new Set([v.id]));cost=raw==null?Infinity:Number(raw);}
 return Number.isFinite(cost)&&cost>=0?cost:Infinity;
}
// Cache only within the CURRENT relay day. Roads, ownership, occupation and
// topology can change between pulses; stale routes are not silently reused.
function bestPair(v,w,d,r,routeCache,s){
 let best=null;
 const candidates=[];for(const a of d.ids)for(const b of r.ids){if(!tileOK(w,v,a)||!tileOK(w,v,b))continue;candidates.push({a,b,md:manhattan(w,a,b)});}
 candidates.sort((p,q)=>p.md-q.md||p.a-q.a||p.b-q.b);
 for(const {a,b} of candidates){const key=a+'>'+b;let cost=routeCache.get(key);
  if(cost===undefined){cost=routeCost(v,w,a,b);routeCache.set(key,cost);s.routePairsChecked++;}else s.routeCacheHits++;
  if(!Number.isFinite(cost))continue;s.routePairsReachable++;
  const regular=v.internalLogisticsCapacity?.(a,b,'food',false);
  // Preserve E2's emergency-capacity fallback, ONLY for two distinct Settlements.
  // Prevent D3_SHARED_POOL_NO_SHIPMENT from ever becoming a positive shipment.
  const carrier=Math.max(1,(d.tileAdults?.get(a)||0)+(r.tileAdults?.get(b)||0)),fallback=Math.max(2,carrier*2.8/(1+cost*.08));
  const cap=Math.max(0,num(regular?.capacity),fallback);
  if(cap<.5)continue;
  if(!best||cost<best.cost-1e-9||(Math.abs(cost-best.cost)<1e-9&&(cap>best.cap+1e-9||Math.abs(cap-best.cap)<1e-9&&(a<best.from||a===best.from&&b<best.to))))best={from:a,to:b,cost,cap};
 }
 return best;
}
function relay(w){
 if(!w||num(w._v24Subday??2)<2)return;const s=stats(w),now=cal(w);s.pulses++;s.lastDay=now;
 for(const v of w.activeVillages||[]){v.v32e1=v.v32e1||{};v.v32e2=v.v32e2||{};v.v32d5=v.v32d5||{};
  const e=v.v32e1;if(now-num(e.lastFoodRelayCal??-99999)<3)continue;e.lastFoodRelayCal=now;s.nationPulses++;
  const state=groups(v,w),cache=new Map();e.foodDonorIndexBuilds=num(e.foodDonorIndexBuilds)+1;s.settlementReads+=state.length;
  const receivers=state.filter(demandUrgent).sort((a,b)=>b.critical-a.critical||b.severe-a.severe||a.days-b.days||a.anchor-b.anchor);
  s.receivers+=receivers.length;s.foodDemand+=receivers.reduce((a,x)=>a+x.need,0);
  // Original E2 caps urgency processing at four destinations per nation and pulse.
  for(const r of receivers.slice(0,4)){
   const crisis=r.critical>0||r.severe>0||r.days<8||r.avgHunger>=72;
   const floor=crisis?24:40;
   const donors=state.filter(d=>d.sid!==r.sid&&donorOK(d,floor)&&d.stock-d.need*floor>=.5);
   s.skippedSameSettlement++; // intentionally exclude the requesting Settlement
   if(!donors.length){block(s,'DONOR_RESERVE');continue;}
   const remembered=e.recentFoodDonor?.['settlement:'+r.sid];
   const shortlist=donors.map(d=>({d,md:Math.min(...d.ids.flatMap(a=>r.ids.map(b=>manhattan(w,a,b))))})).sort((a,b)=>(a.d.sid===remembered?-100:0)+a.md*2.6-(b.d.sid===remembered?-100:0)-b.md*2.6||b.d.days-a.d.days||a.d.anchor-b.d.anchor).slice(0,5).map(x=>x.d);
   v.v32e2.foodCandidateShortlists=num(v.v32e2.foodCandidateShortlists)+1;
   let best=null,routeSeen=false,capacitySeen=false;
   for(const d of shortlist){s.donorCandidates++;const pair=bestPair(v,w,d,r,cache,s);if(!pair)continue;routeSeen=true;if(pair.cap<.5)continue;capacitySeen=true;
    const surplus=Math.max(0,d.stock-d.need*floor);
    const score=pair.cost*2.4-d.days*.10-d.stock*.002-(d.sid===remembered?.8:0);
    if(!best||score<best.score||score===best.score&&d.anchor<best.d.anchor)best={...pair,d,score,surplus};
   }
   if(!best){block(s,!routeSeen?'NO_ROUTE':!capacitySeen?'CAPACITY':'NO_STOCK');continue;}
   const target=crisis?38:30;
   const need=Math.max(0,r.need*target-r.stock);
   const qty=Math.min(need,best.surplus,best.cap*(r.critical>0?2:1.35),r.room);
   if(qty<.5){block(s,r.room<.5?'STORAGE':'CAPACITY');continue;}
   // Physical withdrawals / deposits use D3's existing conserved Settlement pool.
   const initial=num(v.stockAt?.(best.from,'food'))+num(v.stockAt?.(best.to,'food'));
   const took=num(v.withdrawAt(best.from,'food',qty));
   const put=num(v.depositAt(best.to,'food',took));
   const rejected=Math.max(0,took-put);
   if(rejected>1e-9){const restored=num(v.depositAt(best.from,'food',rejected));s.returned+=restored;if(restored+1e-7<rejected){s.failedReturns++;block(s,'RETURN_FAILED');}}
   if(put<=0){block(s,'STORAGE');continue;}
   const final=num(v.stockAt?.(best.from,'food'))+num(v.stockAt?.(best.to,'food'));
   if(Math.abs(final-initial)>1e-6){s.physicalMismatch++;block(s,'CONSERVATION');}
   e.recentFoodDonor=e.recentFoodDonor||{};e.recentFoodDonor['settlement:'+r.sid]=best.d.sid;
   v.logisticsStats=v.logisticsStats||{};v.logisticsStats.moves=num(v.logisticsStats.moves)+1;v.logisticsStats.foodMoved=num(v.logisticsStats.foodMoved)+put;
   v.v32d5.foodRelayMoves=num(v.v32d5.foodRelayMoves)+1;v.v32d5.foodRelayQty=num(v.v32d5.foodRelayQty)+put;
   s.shipments++;s.quantity+=put;
   s.retainedRoutes.push({day:now,nation:v.name,fromSettlementId:best.d.sid,toSettlementId:r.sid,fromTileId:best.from,toTileId:best.to,cost:n5(best.cost),qty:n5(put),donorCycles:n5(best.d.days),receiverCycles:n5(r.days)});
   if(s.retainedRoutes.length>300)s.retainedRoutes.shift();
   w.telemetry?.record?.('NATIONAL_FOOD_RELAY32D5',w,{village:v.name,villageId:v.id,fromSettlementId:best.d.sid,toSettlementId:r.sid,fromTileId:best.from,toTileId:best.to,qty:+put.toFixed(2),routeCost:+best.cost.toFixed(2),receiverDaysBefore:+r.days.toFixed(1),donorDaysBefore:+best.d.days.toFixed(1),severeHunger:r.severe,criticalHunger:r.critical,model:'V0.34G2_SETTLEMENT_ROUTE'});
  }
 }
}
function summary(w){const s=stats(w);return{...s,quantity:n5(s.quantity),returned:n5(s.returned),retainedRoutes:s.retainedRoutes.length,transportRule:'same-nation unified food relief (V27/V28/E2 replaced)',demandBasis:'F0 age-weighted demand per 3-day work cycle',endpointChoice:'minimum actual passable route cost among Settlement member tile pairs',cadence:'3-day work cycle / before consumption',internalShipmentForbidden:true,conservationErrors:s.physicalMismatch+s.failedReturns};}
const HEAD=['day','nation','fromSettlementId','toSettlementId','fromTileId','toTileId','cost','qty','donorCycles','receiverCycles'];
const csv=w=>[HEAD.join(','),...stats(w).retainedRoutes.map(r=>HEAD.map(k=>'"'+String(r[k]??'').replace(/"/g,'""')+'"').join(','))].join('\n');
function download(name,contents,mime){const url=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const sav=NS.SaveSystem;
NS.SaveSystem={...sav,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g1b')||localStorage.getItem('village-observer-v034g1a')||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034G2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034G2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportG2Routes(w){download(`village-observer-v034G2-relay-routes-${w.telemetry?.sessionId||'session'}.csv`,'\ufeff'+csv(w),'text/csv;charset=utf-8');}
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g2={policy:'Settlement-level unified food relief',schema:'G1B-compatible',notes:'G2 audit counters are transient'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const json=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=json.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g2=summary(w);return j;};
if(NS.UI){const header=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const x=header.apply(this,args);document.title='Village Observer '+VERSION;const label=document.getElementById('versionBadge');if(label)label.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const near=document.getElementById('exportLogisticsAuditG1Btn');if(near&&!document.getElementById('exportG2RelayBtn')){const b=document.createElement('button');b.id='exportG2RelayBtn';b.textContent='G2 정착지 배송 CSV';b.title='정착지 간 실제 배송 경로·식량량 (최대 최근 300건)';b.addEventListener('click',()=>NS.SaveSystem.exportG2Routes(this.world));near.insertAdjacentElement('afterend',b);}return x;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'정착지 단위 통합 식량 구호 V2',summary:'V27·V28·E2의 타일별 식량 구호를 정착지 공동 재고·연령별 수요로 통합하고, 실제 통행 가능한 타일 쌍을 통해 배송합니다.',sections:[['정착지 기준 판단',['F0/F2의 실제 연령별 3일 작업주기 식량 수요와 D3의 물리 공동 식량 재고를 정착지마다 한 번 집계합니다.','동일 정착지 내부 수송은 후보에서 제외하며, 국가 내 서로 다른 정착지 간에만 긴급 보급합니다.']],['물리 배송 경로',['양쪽 정착지의 점령되지 않은 소속 타일의 실제 경로비를 비교해 가장 저렴한 출발·도착 타일 쌍을 선택합니다.','기존 용량·재고 출고·도착지 저장 공간·잔량 원상복구·식량 보존식은 유지합니다.']],['검증 및 범위',['G2는 기존 구호를 대체해 3일 작업주기 직전에 한 번 실행됩니다. 배송 CSV 및 DEVLOG worldSummary.v034g2를 추가합니다.','기존 V27·V28·E2 식량 구호는 G2 단일 루틴으로 대체합니다. 국내 상업 거래, 국제 교역, F3 신진대사, 군사 이동, 정착지 병합 범위는 변경하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034G2=Object.freeze({version:VERSION,relay,groups,bestPair,summary,csv});
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);

;
/* H1B2 bundled source: v034g2a.js */
/* V0.34G2A Settlement Logistics V2 — donor live-surplus & crisis audit.
 * A Settlement owns exactly one food demand and one physical pool. Inter-Settlement
 * delivery chooses a legal reachable tile pair using the real route cost. No RNG.
 * Legacy V27/V28/E2 food relief is retained only as a pre-bootstrap fallback.
 */
(function(NS){'use strict';
const VERSION='V0.34G2A',PREVIOUS='V0.34G2',KEY='village-observer-v034g2a';
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b);
const cal=w=>num(w?.calendarOrdinalDay?.()??((w?.ordinalDay?.()||0)*3));
const n5=x=>+num(x).toFixed(5);
const diag=new WeakMap();
function stats(w){let s=diag.get(w);if(!s){s={pulses:0,nationPulses:0,settlementReads:0,receivers:0,donorCandidates:0,skippedSameSettlement:0,routePairsChecked:0,routePairsReachable:0,routeCacheHits:0,blocked:{},shipments:0,quantity:0,returned:0,failedReturns:0,invalidEndpoints:0,physicalMismatch:0,foodDemand:0,hiddenLegacyShortages:0,reserveChecks:0,reserveViolations:0,maxReserveShortfall:0,donorRefreshes:0,receiverRefreshes:0,alternativeDonorsUsed:0,receiversWithMultipleDonors:0,retainedRoutes:[],lastDay:-1};diag.set(w,s);}return s;}
const block=(s,k)=>s.blocked[k]=(s.blocked[k]||0)+1;
function tileOK(w,v,tid){const t=w.map?.get(Number(tid));return !!(t&&same(t.ownerId,v.id)&&!(t.v33OccupierId!=null&&!same(t.v33OccupierId,v.id)));}
function groups(v,w){
 const g=new Map(),byTile=new Map(),territory=Array.from(v.territory||[],Number).sort((a,b)=>a-b);
 for(const id of territory){if(!tileOK(w,v,id))continue;const t=w.map.get(id),sid=t.settlementId!=null?String(t.settlementId):'tile:'+id;
  let x=g.get(sid);if(!x){x={sid,ids:[],anchor:id,pop:0,adults:0,tileAdults:new Map(),severe:0,critical:0,hunger:0,need:0,stock:0,days:0,avgHunger:0,room:0};g.set(sid,x);}
  x.ids.push(id);byTile.set(id,x);x.stock+=num(NS.V034D3?.stockRaw?.(w,id,'food')??t.stocks?.food);
  x.room+=Math.max(0,num(NS.V034D3?.physicalCap?.(v,id,'food'))-num(NS.V034D3?.stockRaw?.(w,id,'food')??t.stocks?.food));
 }
 for(const p of v.residents||[]){if(p.alive===false)continue;const x=byTile.get(Number(p.homeTileId));if(!x)continue;
  x.pop++;x.need+=num(NS.V034F0?.needFor?.(p)??(num(p.age)<15?.30:.42));x.hunger+=num(p.hunger);
  if(num(p.hunger)>=85)x.severe++;if(num(p.hunger)>=95)x.critical++;
  if(num(p.age)>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'){x.adults++;const tid=Number(p.homeTileId);x.tileAdults.set(tid,(x.tileAdults.get(tid)||0)+1);}
 }
 for(const x of g.values()){x.avgHunger=x.pop?x.hunger/x.pop:0;x.days=x.pop?x.stock/Math.max(.12,x.need):999;}
 return [...g.values()].filter(x=>x.pop>0).sort((a,b)=>a.anchor-b.anchor);
}
const demandUrgent=x=>x.days<(x.pop>=4?18:10)||x.critical>0||x.severe>0||x.avgHunger>=58;
const donorOK=(x,floor)=>x.days>floor&&x.stock>Math.max(8,x.need*floor);
const manhattan=(w,a,b)=>{const x=w.map.get(a),y=w.map.get(b);return Math.abs(num(x?.x)-num(y?.x))+Math.abs(num(x?.y)-num(y?.y));};
function routeCost(v,w,from,to){
 const first=v.internalPathCost?.(from,to);let cost=first==null?Infinity:Number(first);
 if(!Number.isFinite(cost)){const raw=w.map.tradePathCost?.([from],[to],new Set([v.id]));cost=raw==null?Infinity:Number(raw);}
 return Number.isFinite(cost)&&cost>=0?cost:Infinity;
}
// Cache only within the CURRENT relay day. Roads, ownership, occupation and
// topology can change between pulses; stale routes are not silently reused.
function bestPair(v,w,d,r,routeCache,s){
 let best=null;
 const candidates=[];for(const a of d.ids)for(const b of r.ids){if(!tileOK(w,v,a)||!tileOK(w,v,b))continue;candidates.push({a,b,md:manhattan(w,a,b)});}
 candidates.sort((p,q)=>p.md-q.md||p.a-q.a||p.b-q.b);
 for(const {a,b} of candidates){const key=a+'>'+b;let cost=routeCache.get(key);
  if(cost===undefined){cost=routeCost(v,w,a,b);routeCache.set(key,cost);s.routePairsChecked++;}else s.routeCacheHits++;
  if(!Number.isFinite(cost))continue;s.routePairsReachable++;
  const regular=v.internalLogisticsCapacity?.(a,b,'food',false);
  // Preserve E2's emergency-capacity fallback, ONLY for two distinct Settlements.
  // Prevent D3_SHARED_POOL_NO_SHIPMENT from ever becoming a positive shipment.
  const carrier=Math.max(1,(d.tileAdults?.get(a)||0)+(r.tileAdults?.get(b)||0)),fallback=Math.max(2,carrier*2.8/(1+cost*.08));
  const cap=Math.max(0,num(regular?.capacity),fallback);
  if(cap<.5)continue;
  if(!best||cost<best.cost-1e-9||(Math.abs(cost-best.cost)<1e-9&&(cap>best.cap+1e-9||Math.abs(cap-best.cap)<1e-9&&(a<best.from||a===best.from&&b<best.to))))best={from:a,to:b,cost,cap};
 }
 return best;
}
// Read physical stock after EACH withdrawal/deposit. Group identity and
// demand stay constant during one synchronous pulse; real inventory does not.
function refreshStock(w,v,g,s,receiver=false){
 g.stock=num(v.stockAt?.(g.anchor,'food')??g.ids.reduce((a,id)=>a+num(NS.V034D3?.stockRaw?.(w,id,'food')??w.map.get(id)?.stocks?.food),0));
 g.days=g.pop?g.stock/Math.max(.12,g.need):999;
 g.room=g.ids.reduce((a,id)=>a+Math.max(0,num(NS.V034D3?.physicalCap?.(v,id,'food'))-num(NS.V034D3?.stockRaw?.(w,id,'food')??w.map.get(id)?.stocks?.food)),0);
 if(receiver)s.receiverRefreshes++;else s.donorRefreshes++;
}
const reserveAmount=(d,floor)=>Math.max(8,d.need*floor);
function relay(w){
 if(!w||num(w._v24Subday??2)<2)return;
 const s=stats(w),now=cal(w);s.pulses++;s.lastDay=now;
 for(const v of w.activeVillages||[]){
  v.v32e1=v.v32e1||{};v.v32e2=v.v32e2||{};v.v32d5=v.v32d5||{};
  const e=v.v32e1;
  if(now-num(e.lastFoodRelayCal??-99999)<3)continue;
  e.lastFoodRelayCal=now;s.nationPulses++;
  const state=groups(v,w),cache=new Map();e.foodDonorIndexBuilds=num(e.foodDonorIndexBuilds)+1;s.settlementReads+=state.length;
  const receivers=state.filter(demandUrgent).sort((a,b)=>(NS.V034G3?.receiverRank?.(b)||0)-(NS.V034G3?.receiverRank?.(a)||0)||b.critical-a.critical||b.severe-a.severe||a.days-b.days||a.anchor-b.anchor);
  s.receivers+=receivers.length;s.foodDemand+=receivers.reduce((a,x)=>a+x.need,0);
  for(const r of receivers.slice(0,4)){
   const crisis=r.critical>0||r.severe>0||r.days<8||r.avgHunger>=72;
   const basePlan={floor:crisis?24:40,target:crisis?38:30},plan=NS.V034G3?.reliefPlan?.(w,r,state,basePlan)||basePlan;
   const {floor,target}=plan;
   const remembered=e.recentFoodDonor?.['settlement:'+r.sid];
   const attempted=new Set();let deliveries=0;
   // At most five distinct donors per receiver. A selected donor is consumed
   // once per pulse; next candidate must use the updated physical inventory.
   for(let attempt=0;attempt<5;attempt++){
    refreshStock(w,v,r,s,true);
    const shortage=Math.max(0,r.need*target-r.stock);
    if(shortage<.5||r.room<.5)break;
    const donors=state.filter(d=>{
     if(d.sid===r.sid||attempted.has(d.sid))return false;
     refreshStock(w,v,d,s);
     return (plan.mode!=='IMMINENT'||(d.severe===0&&d.critical===0))&&d.stock-reserveAmount(d,floor)>=.5;
    });
    s.skippedSameSettlement++;
    if(!donors.length){block(s,'DONOR_RESERVE');break;}
    const shortlist=donors.map(d=>({d,md:Math.min(...d.ids.flatMap(a=>r.ids.map(b=>manhattan(w,a,b))))}))
     .sort((a,b)=>(a.d.sid===remembered?-100:0)+a.md*2.6-(b.d.sid===remembered?-100:0)-b.md*2.6||b.d.days-a.d.days||a.d.anchor-b.d.anchor).slice(0,5).map(x=>x.d);
    v.v32e2.foodCandidateShortlists=num(v.v32e2.foodCandidateShortlists)+1;
    let best=null,routeSeen=false,capacitySeen=false;
    for(const d of shortlist){
     s.donorCandidates++;
     const pair=bestPair(v,w,d,r,cache,s);
     if(!pair)continue;routeSeen=true;
     if(pair.cap<.5)continue;capacitySeen=true;
     const liveSurplus=Math.max(0,d.stock-reserveAmount(d,floor));
     if(liveSurplus<.5)continue;
     const score=pair.cost*2.4-d.days*.10-d.stock*.002-(d.sid===remembered?.8:0);
     if(!best||score<best.score||score===best.score&&d.anchor<best.d.anchor)best={...pair,d,score,surplus:liveSurplus};
    }
    if(!best){block(s,!routeSeen?'NO_ROUTE':!capacitySeen?'CAPACITY':'NO_STOCK');break;}
    attempted.add(best.d.sid);
    const d=best.d;
    // Final just-in-time read protects against stale surplus selection.
    refreshStock(w,v,d,s);refreshStock(w,v,r,s,true);
    const reserve=reserveAmount(d,floor),donorStockBefore=d.stock;
    const available=Math.max(0,donorStockBefore-reserve);
    const required=Math.max(0,r.need*target-r.stock);
    const qty=Math.min(required,available,best.cap*(r.critical>0?2:1.35),r.room);
    if(qty<.5){block(s,r.room<.5?'STORAGE':'DONOR_RESERVE');continue;}
    const receiverBefore=r.stock;
    const totalBefore=num(v.stockAt?.(best.from,'food'))+num(v.stockAt?.(best.to,'food'));
    const took=num(v.withdrawAt(best.from,'food',qty));
    const put=num(v.depositAt(best.to,'food',took));
    const rejected=Math.max(0,took-put);
    if(rejected>1e-9){
     const restored=num(v.depositAt(best.from,'food',rejected));s.returned+=restored;
     if(restored+1e-7<rejected){s.failedReturns++;block(s,'RETURN_FAILED');}
    }
    refreshStock(w,v,d,s);refreshStock(w,v,r,s,true);
    const totalAfter=d.stock+r.stock;
    if(Math.abs(totalAfter-totalBefore)>1e-6){s.physicalMismatch++;block(s,'CONSERVATION');}
    if(put<=0){block(s,'STORAGE');continue;}
    s.reserveChecks++;
    const reserveShortfall=Math.max(0,reserve-d.stock);
    if(reserveShortfall>1e-6){s.reserveViolations++;s.maxReserveShortfall=Math.max(s.maxReserveShortfall,reserveShortfall);block(s,'RESERVE_VIOLATION');}
    if(deliveries>0)s.alternativeDonorsUsed++;
    deliveries++;
    e.recentFoodDonor=e.recentFoodDonor||{};e.recentFoodDonor['settlement:'+r.sid]=d.sid;
    v.logisticsStats=v.logisticsStats||{};v.logisticsStats.moves=num(v.logisticsStats.moves)+1;v.logisticsStats.foodMoved=num(v.logisticsStats.foodMoved)+put;
    v.v32d5.foodRelayMoves=num(v.v32d5.foodRelayMoves)+1;v.v32d5.foodRelayQty=num(v.v32d5.foodRelayQty)+put;
    s.shipments++;s.quantity+=put;NS.V034G3?.onDelivery?.(w,plan.mode,put);
    s.retainedRoutes.push({day:now,nation:v.name,fromSettlementId:d.sid,toSettlementId:r.sid,fromTileId:best.from,toTileId:best.to,cost:n5(best.cost),qty:n5(put),donorCycles:n5(donorStockBefore/Math.max(.12,d.need)),receiverCycles:n5(receiverBefore/Math.max(.12,r.need)),donorStockBefore:n5(donorStockBefore),donorStockAfter:n5(d.stock),donorRequired:n5(reserve),donorSurplusBefore:n5(available),donorCyclesAfter:n5(d.days),receiverStockAfter:n5(r.stock),receiverCyclesAfter:n5(r.days),reserveViolation:reserveShortfall>1e-6?1:0,reliefMode:plan.mode||'STANDARD',reliefFloorCycles:floor});
    if(s.retainedRoutes.length>300)s.retainedRoutes.shift();
    w.telemetry?.record?.('NATIONAL_FOOD_RELAY32D5',w,{village:v.name,villageId:v.id,fromSettlementId:d.sid,toSettlementId:r.sid,fromTileId:best.from,toTileId:best.to,qty:+put.toFixed(2),routeCost:+best.cost.toFixed(2),receiverDaysBefore:+(receiverBefore/Math.max(.12,r.need)).toFixed(1),donorDaysBefore:+(donorStockBefore/Math.max(.12,d.need)).toFixed(1),donorDaysAfter:+d.days.toFixed(1),donorReserveRequired:+reserve.toFixed(3),donorReserveShortfall:+reserveShortfall.toFixed(5),severeHunger:r.severe,criticalHunger:r.critical,model:NS.V034G3?'V0.34G3_CRISIS_PRIORITY':'V0.34G2A_LIVE_SURPLUS',reliefMode:plan.mode||'STANDARD',reliefFloorCycles:floor});
   }
   if(deliveries>1)s.receiversWithMultipleDonors++;
  }
 }
}
function summary(w){const s=stats(w);return{...s,quantity:n5(s.quantity),returned:n5(s.returned),retainedRoutes:s.retainedRoutes.length,transportRule:'same-nation unified food relief (V27/V28/E2 replaced)',demandBasis:'F0 age-weighted demand per 3-day work cycle',endpointChoice:'minimum actual passable route cost among Settlement member tile pairs',cadence:'3-day work cycle / before consumption',internalShipmentForbidden:true,conservationErrors:s.physicalMismatch+s.failedReturns};}
const HEAD=['day','nation','fromSettlementId','toSettlementId','fromTileId','toTileId','cost','qty','donorCycles','receiverCycles','donorStockBefore','donorStockAfter','donorRequired','donorSurplusBefore','donorCyclesAfter','receiverStockAfter','receiverCyclesAfter','reserveViolation','reliefMode','reliefFloorCycles'];
const csv=w=>[HEAD.join(','),...stats(w).retainedRoutes.map(r=>HEAD.map(k=>'"'+String(r[k]??'').replace(/"/g,'""')+'"').join(','))].join('\n');
function download(name,contents,mime){const url=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const sav=NS.SaveSystem;
NS.SaveSystem={...sav,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const raw=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g2')||localStorage.getItem('village-observer-v034g1b')||localStorage.getItem('village-observer-v034g1a')||localStorage.getItem('village-observer-v034g1')||localStorage.getItem('village-observer-v034f3');return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download(`village-observer-v034G2-save-${w.year}y.json`,JSON.stringify(w.serialize()),'application/json');},
 exportDevJSON(w){download(`village-observer-v034G2-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)),'application/json');},
 exportG2Routes(w){download(`village-observer-v034G2A-relay-routes-${w.telemetry?.sessionId||'session'}.csv`,'\ufeff'+csv(w),'text/csv;charset=utf-8');},exportG2ARoutes(w){this.exportG2Routes(w);}
};
const serialize=NS.World.prototype.serialize,from=NS.World.from;
NS.World.prototype.serialize=function(){const d=serialize.call(this);d.version=VERSION;d.v034g2a={policy:'Settlement-level unified food relief',schema:'G1B-compatible',notes:'G2 audit counters are transient'};return d;};
NS.World.from=function(d){if(!d||typeof d!=='object')throw Error('잘못된 세이브');return from(d.version===VERSION?{...d,version:PREVIOUS}:d);};
const json=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const j=json.call(this,w);j.version=VERSION;j.worldSummary=j.worldSummary||{};j.worldSummary.v034g2=summary(w);j.worldSummary.v034g2a=summary(w);return j;};
if(NS.UI){const header=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const x=header.apply(this,args);document.title='Village Observer '+VERSION;const label=document.getElementById('versionBadge');if(label)label.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const button=document.getElementById('exportG2RelayBtn');if(button){button.textContent='G2A 정착지 배송 CSV';button.title='실제 정착지 간 배송 + 공급원 보호 비축량 감사 (최근 300건)';}return x;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'실시간 공급원 잉여량·보호 비축 안정화',summary:'G2 국가 내 정착지 간 긴급 구호에서 공급원 잉여 식량을 배송마다 재평가하고 비축 보호 위반을 관측합니다.',sections:[['공급원 비축 보호',['정착지 공급원의 24/40 작업주기 보호 비축(최소 8 식량)은 배송할 때마다 실제 물리 재고에서 다시 계산합니다.','같은 작업주기에 여러 정착지에 공급해도 이미 보낸 식량을 중복으로 계산하지 않습니다.']],['대체 공급원 재탐색',['첫 공급원 소진 시 다른 실제 경로의 공급원을 재탐색합니다. 수령 정착지의 실제 공동 재고·저장 여유도 매번 갱신합니다.','한 대상 정착지에 최대 다섯 개의 서로 다른 공급원을 사용할 수 있으며, 기존 한 국가 최대 네 대상·다섯 후보 탐색 제한을 유지합니다.']],['감사·검증',['배송 CSV에 공급 전·후 공동 재고, 보호 비축 하한과 부족 여부를 추가했습니다.','G2의 정착지 단위 수요·출발/도착 타일 경로·D3 물리 회계·F3 개인 신진대사·AI 전쟁은 변경하지 않습니다.']]]});
NS.RELEASE_VERSION=VERSION;
NS.V034G2=Object.freeze({...NS.V034G2,version:VERSION,relay,groups,bestPair,summary,csv});NS.V034G2A=Object.freeze({version:VERSION,relay,groups,bestPair,summary,routes:w=>stats(w).retainedRoutes,csv});
try{window.villageObserver?.renderHeader?.();}catch(_e){}
})(window.VSim);

;
/* H1B2 bundled source: v034g3.js */
/* V0.34G3 — Settlement Evolution + crisis-aware physical food relief.
 * Spatial geometry: Euclidean circle AND bidirectional real traversable path.
 * Relief: only imminent starvation may reach a guarded lower floor (18 cycles).
 * No new food / no relaxed transport conservation / no RNG.
 */
(function(NS){'use strict';
const VERSION='V0.34G3',PREV='V0.34G2A',KEY='village-observer-v034g3',EPS=1e-8;
const config={spatialEnabled:true,foodEnabled:true};
const same=(a,b)=>String(a)===String(b), num=x=>Number.isFinite(Number(x))?Number(x):0;
let observationDepth=0;
function observe(read){observationDepth++;try{return read();}finally{observationDepth--;}}
const metrics=new WeakMap(),snap=w=>{let m=metrics.get(w);if(!m){m={policies:0,pathSweeps:0,expandedTier3:0,expandedTier4:0,reliefPlans:0,imminentPlans:0,imminentRejected:0,emergencyQty:0,emergencyShipments:0};metrics.set(w,m);}return m;};
// Stable maximum footprint grows with actual developed population and buildings.
// The tier is derived from current physical settlements; mergers may use pooled
// prospective population, so expansion beyond old 13 tiles becomes attainable.
function policy(w,ids,core){
 const c=w.map.get(Number(core));if(!c)return {radius:0,cap:0,join:0,split:0,tier:0};
 const allowed=new Set(ids.map(Number));let built=0,pop=0;
 for(const id of allowed){const t=w.map.get(id);if(!t||!same(t.ownerId,c.ownerId))continue;built+=(t.buildings||[]).filter(b=>b!=='road'&&b!=='outpost').length;}
 const v=w.villages?.find(v=>same(v.id,c.ownerId));
 if(v){for(const p of v.residents||[]){if(p.alive!==false&&allowed.has(Number(p.homeTileId)))pop++;}}
 const computedTier=pop>=30&&built>=6?4:pop>=12&&built>=2?3:2;
 const record=w.v34b?.settlements?.find(r=>r.lifecycle==='ACTIVE'&&r.coreTileId===Number(core)&&same(r.nationId,c.ownerId));
 const tier=Math.max(computedTier,num(record?.v034g3MaxTier||2));
 if(!observationDepth){const m=snap(w);m.policies++;if(tier===3)m.expandedTier3++;if(tier===4)m.expandedTier4++;}
 const radius=tier,cap=tier===4?49:tier===3?29:13;
 // Conservative travel windows: roads contribute 0.62 each while terrain is
 // authoritative. Both constraints expand; circle is never implied by path.
 const legacyJoin=tier===4?4.34:tier===3?3.10:1.24;
 // G3B changes NEW integration only. Existing split grace windows retain G3.
 const join=NS.V034G3B?.joinLimit??legacyJoin;
 return {radius,cap,join,split:legacyJoin+(tier===2?.16:.35),tier,pop,built};
}
function promote(w,r){const p=policy(w,r.tileIds,r.coreTileId);r.v034g3MaxTier=Math.max(num(r.v034g3MaxTier||2),p.tier);}
function withinRadius(w,ids,core){const p=policy(w,ids,core),c=w.map.get(Number(core));if(!c||ids.length>p.cap)return false;
 return ids.every(id=>{const t=w.map.get(Number(id));return !!t&&(t.x-c.x)**2+(t.y-c.y)**2<=p.radius*p.radius+EPS;});}
function maximumJoinCap(w,a,b){const ids=a.tileIds.concat(b.tileIds);return Math.max(policy(w,ids,a.coreTileId).cap,policy(w,ids,b.coreTileId).cap);}
const pathLimit=(w,ids,core,phase)=>policy(w,ids,core)[phase]??Infinity;
// Two bounded Dijkstra sweeps instead of up to 2*N separate shortest paths.
// In reverse sweep, the cost of the original edge u->v is paid on v.
function bothReachable(w,ids,core,limit){const allow=new Set(ids.map(Number)),source=Number(core);if(!allow.has(source))return false;
 const info=new Map();for(const id of allow){const t=w.map.get(id);if(!t||!NS.TERRAIN?.[t.terrain]?.passable)return false;
  const i=t.buildings?.indexOf('road')??-1,v=w.villages?.find(v=>same(v.id,t.ownerId)),road=i>=0&&num(t.buildingCondition?.[i]??100)>=25&&!!v?.hasTech?.('ROADS');
  info.set(id,(NS.V034G4?.spatialStep?.(w,t)??(num(NS.TERRAIN[t.terrain].tradeCost||1)*(road?.62:1))));}
 function sweep(reverse){const best=new Map([[source,0]]),todo=[[0,source]];while(todo.length){todo.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const [d,u]=todo.shift();if(d>limit+EPS)return false;if(d>best.get(u)+EPS)continue;
  for(const e of w.map.neighbors4(u)){const v=e.id;if(!allow.has(v))continue;const cost=reverse?info.get(u):info.get(v),nd=d+cost;if(nd>limit+EPS||nd>=((best.get(v)??Infinity)-EPS))continue;best.set(v,nd);todo.push([nd,v]);}}
 return best.size===allow.size;}
 if(!observationDepth)snap(w).pathSweeps+=2;return sweep(false)&&sweep(true);
}
function candidateExtension(v,w,c){const t=c?.tile||w?.map?.get?.(Number(c?.targetTileId??c?.tileId));
 if(!t||t.ownerId!=null||!v?.hasTech?.('ROADS')||!NS.V034C)return null;
 let best=null;for(const n of w.map.neighbors4(t.id)){
  if(!same(n.ownerId,v.id))continue;
  const r=NS.V034C.byTile(w,n.id);if(!r||r.lifecycle!=='ACTIVE')continue;
  const ids=[...r.tileIds,t.id],p=policyProjected(w,ids,r.coreTileId,v.id);
  const center=w.map.get(r.coreTileId);if(!center||ids.length>p.cap||(t.x-center.x)**2+(t.y-center.y)**2>p.radius*p.radius+EPS)continue;
  const allow=new Set(r.tileIds),out=NS.V034C.path(w,center.id,n.id,allow,p.join),back=NS.V034C.path(w,n.id,center.id,allow,p.join);
  const roadStep=num(NS.TERRAIN?.[t.terrain]?.tradeCost||1); // unowned target has NO physical road
  const roadIndex=n.buildings?.indexOf('road')??-1,nroad=roadIndex>=0&&num(n.buildingCondition?.[roadIndex]??100)>=25;
  const backStep=NS.V034G4?.spatialStep?.(w,n)??(num(NS.TERRAIN?.[n.terrain]?.tradeCost||1)*(nroad?.62:1));
  if(out+roadStep>p.join+EPS||back+backStep>p.join+EPS)continue;
  const row={settlementId:r.id,coreTileId:r.coreTileId,sourceTileId:n.id,targetTileId:t.id,tilesAfter:ids.length,projectedOut:+(out+roadStep).toFixed(3),projectedReturn:+(back+backStep).toFixed(3),g3Radius:p.radius};
  if(!best||r.tileIds.length>best.tilesAfter-1||r.tileIds.length===best.tilesAfter-1&&String(r.id)<String(best.settlementId))best=row;
 }
 return best;
}
function policyProjected(w,ids,core,nationId){ // target is unowned during scoring; inherit projected nation only for population grouping
 const p=policy(w,ids.filter(id=>w.map.get(id)?.ownerId!=null),core);
 return p;
}
function nationalFoodCycles(state){const sum=state.reduce((s,x)=>s+x.stock,0),need=state.reduce((s,x)=>s+x.need,0);return sum/Math.max(.12,need);}
function reliefPlan(w,r,state,baseline){const m=snap(w);m.reliefPlans++;if(!config.foodEnabled)return {...baseline,mode:'STANDARD'};
 // Hunger95 + almost no food, or sustained extreme hunger + imminent depletion.
 // The national 20-cycle test protects other citizens from a cascading crisis.
 const imminent=(r.critical>0&&r.days<3)||(r.severe>0&&r.days<1.5);
 const nationalCycles=nationalFoodCycles(state),hasDonor=state.some(x=>x.sid!==r.sid&&x.severe===0&&x.critical===0&&x.stock>Math.max(8,x.need*18));
 if(imminent&&nationalCycles>=20&&hasDonor){m.imminentPlans++;return {floor:18,target:24,mode:'IMMINENT'};}
 if(imminent)m.imminentRejected++;
 return {...baseline,mode:'STANDARD'};
}
function receiverRank(r){if(!config.foodEnabled)return 0;
 return r.critical>0&&r.days<3?3:r.severe>0&&r.days<1.5?2:r.critical>0?1:0;}
function onDelivery(w,mode,qty){if(mode==='IMMINENT'){const m=snap(w);m.emergencyShipments++;m.emergencyQty+=qty;}}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g3={revision:'circle-and-travel-cost-plus-imminent-relief',spatial:'derived from physical population/buildings',emergency:'18-cycle donor lower floor only for imminent crisis'};return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){return observe(()=>{const d=oldJSON.call(this,w);d.version=VERSION;
 const m={...snap(w)};d.worldSummary=d.worldSummary||{};
 const tierCounts={R2:0,R3:0,R4:0,over13Tiles:0,maxTiles:0};
 for(const r of w.v34b?.settlements||[]){if(r.lifecycle!=='ACTIVE'||!r.tileIds?.length)continue;
  const p=policy(w,r.tileIds,r.coreTileId);tierCounts['R'+p.tier]=(tierCounts['R'+p.tier]||0)+1;
  if(r.tileIds.length>13)tierCounts.over13Tiles++;tierCounts.maxTiles=Math.max(tierCounts.maxTiles,r.tileIds.length);}
 d.worldSummary.v034g3={...m,activeGrowthTiers:tierCounts,geometry:'Euclidean radius AND bidirectional owned-tile path',growth:'R2/13 -> R3/29 -> R4/49; population+buildings',food:'priority imminent crisis; 18-cycle donor safeguard with >=20 national cycles',g2aSummaryRetained:true};return d;});};
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const text=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v034g2a')||localStorage.getItem('village-observer-v034g2')||localStorage.getItem('village-observer-v034g1b');return text?NS.World.from(JSON.parse(text)):null;},
 export(w){download(`village-observer-v034G3-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){download(`village-observer-v034G3-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download(`village-observer-v034G3-relay-routes-${w.telemetry?.sessionId||'session'}.csv`,'\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};
NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
function download(file,contents,mime='application/json'){const url=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=url;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const result=old.apply(this,a);document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge)badge.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';const x=document.getElementById('exportG2RelayBtn');if(x){x.textContent='G3 구호 배송 CSV';x.title='정착지별 식량 구호 및 일반·긴급 보호 기준 (최근 300건)';}return result;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'정착지 원형 확장과 기아 임박 구호 안정화',summary:'정착지 병합·분할은 유클리드 원형 반경 및 실제 왕복 경로를 함께 충족해야 하고, 실제 기아 임박 시 안전 조건하에서 구호 우선순위를 높입니다.',sections:[['성장하는 공간 구조',['기본 반경 2·최대 13타일, 인구 12명·건물 2개 이상 반경 3·29타일, 인구 30명·건물 6개 이상 반경 4·49타일.','유클리드 반경 AND 실제 왕복 통행 경로비를 동시에 적용하며, 도로·지형·소유권을 보존합니다.']],['비상 구호',['기존 24/40 작업주기 보호 기준을 유지하며 기아가 임박한 정착지만 18주기 하한을 검토합니다.','국가 비축 20주기 이상, 안전한 공급원 존재 시에만 하한 완화하며 공급원 자신이 심각한 Hunger 상태이면 제외합니다.']],['회귀 검사',['기존 물류·D3 식량 재고 보존과 3일 작업주기·국제 교역/전쟁/신진대사 규칙을 유지합니다.','공간과 식량 변경을 별도로 켜고 끌 수 있어 개발 회귀 원인을 구분할 수 있습니다.']]]});
NS.V034G3=Object.freeze({version:VERSION,config,policy,observe,promote,withinRadius,maximumJoinCap,pathLimit,bothReachable,candidateExtension,reliefPlan,receiverRank,onDelivery,summary:w=>({...snap(w)})});
})(window.VSim);

;
/* H1B2 bundled source: v034g3a.js */
/* V0.34G3A — Runtime Integrity, UI Synchronization and Read-only Observer.
 * No food/spatial/AI/RNG formula changes. Local large-save validation is a
 * separate generated offline HTML. Built artifact integrity is checked here.
 */
(function(NS){'use strict';
const VERSION='V0.34G3A',PREV='V0.34G3',KEY='village-observer-v034g3a';
const same=(a,b)=>String(a)===String(b);
const verifiedWorlds=new WeakMap();
const number=x=>Number.isFinite(Number(x))?Number(x):0;
function verify(w){
 const tests={
  version:NS.RELEASE_VERSION===VERSION,
  g3Module:!!(NS.V034G3&&NS.V034G3.config?.spatialEnabled&&NS.V034G3.config?.foodEnabled),
  g3FoodHook:typeof NS.V034G2A?.relay==='function'&&/V034G3/.test(Function.prototype.toString.call(NS.V034G2A.relay)),
  g3SpatialHook:typeof NS.V034C?.canJoin==='function'&&/V034G3/.test(Function.prototype.toString.call(NS.V034C.canJoin)),
  g3PathHook:typeof NS.V034C?.canJoin==='function'&&typeof NS.V034G3?.bothReachable==='function'&&/V034G3/.test(Function.prototype.toString.call(NS.V034C.canJoin)),
  g3DeliveryCsv:!!w&&typeof NS.V034G2A?.csv==='function'&&String(NS.V034G2A.csv(w)).replace(/^\uFEFF/,'').split(/\r?\n/,1)[0].split(',').length===20,
  g3Observation:typeof NS.V034G3?.observe==='function'
 };
 return {version:VERSION,build:'g3a-static-v1',ok:Object.values(tests).every(Boolean),tests};
}
function updateUI(){if(NS.V034G3B?.refresh)return NS.V034G3B.refresh();try{
 const w=window.villageObserver?.world;
 let status=w&&verifiedWorlds.get(w);if(!status){status=verify(w);if(w)verifiedWorlds.set(w,status);}
 document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 let node=document.getElementById('g3aRuntimeIntegrity');
 if(!node&&document.body?.appendChild){node=document.createElement('div');node.id='g3aRuntimeIntegrity';node.setAttribute?.('role','status');node.style.cssText='position:relative;z-index:20;margin:2px auto 7px;max-width:1120px;border-radius:9px;padding:7px 10px;font:12px system-ui,sans-serif;border:1px solid '+(status.ok?'#235a4c':'#a64c39')+';color:'+(status.ok?'#a9e7ca':'#ffe0a1')+';background:#0c1b28';const shell=document.querySelector('.shell');const runtime=document.getElementById('runtimeStatus');if(runtime?.parentNode)runtime.parentNode.insertBefore(node,runtime.nextSibling);else shell?.prepend?.(node);}
 if(node){node.textContent=status.ok?'✓ G3A 런타임 무결성: G3 공간·구호 Hook 및 CSV 20열 연결 확인':'⚠ G3A 무결성 검사 실패: '+Object.keys(status.tests).filter(k=>!status.tests[k]).join(', ')+' — 이 세계의 패치 검증을 중단하세요';node.style.borderColor=status.ok?'#235a4c':'#a64c39';node.style.color=status.ok?'#a9e7ca':'#ffe0a1';}
 const btn=document.getElementById('exportG2RelayBtn');if(btn)btn.textContent='G3A 구호 배송 CSV';
 return status;
 }catch(e){console.error('G3A integrity UI error',e);return {ok:false,error:String(e)};}}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const data=oldSerialize.call(this);data.version=VERSION;data.v034g3a={runtimeIntegrity:'g3a-static-v1',balance:'G3_UNCHANGED'};return data;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){return NS.V034G3.observe(()=>{const r=oldJSON.call(this,w);r.version=VERSION;r.worldSummary.v034g3a={revision:'runtime-integrity-local-validation',simulationUnchanged:true,integrity:verify(w).tests};return r;});};
// V034C is deliberately frozen. Read-only clients invoke its inspector through G3.observe().
function audit(w){const v32Stats=w.v32e3OptimizationStats?{...w.v32e3OptimizationStats}:null;try{return NS.V034G3.observe(()=>{
 const c=NS.V034C?.inspect?.(w),d=NS.V034D3?.audit?.(w),f=NS.V034F2?.diagnostics?.(w),g2=NS.V034G2A?.summary?.(w),g3=NS.V034G3?.summary?.(w);
 const world={time:w.timestamp?.(),calendarDay:w.calendarOrdinalDay?.(),population:w.allPeople?.length,activeNations:w.activeVillages?.length,claimedTiles:w.map?.tiles?.filter(t=>t.ownerId!=null).length};
 const people=w.allPeople||[],nations=(w.activeVillages||[]).map(v=>({id:v.id,name:v.name,population:v.population?.(),food:number(v.food),criticalHunger:(v.residents||[]).filter(p=>p.alive!==false&&number(p.hunger)>=95).length,severeHunger:(v.residents||[]).filter(p=>p.alive!==false&&number(p.hunger)>=85).length}));
 const failures={settlement:c?.errors?.length??null,physical:d?.errors?.length??null,metabolismDuplicates:f?.duplicateMetabolismRequests??null,missingHomes:f?.missingHomes??null,conservation:g2?.conservationErrors??null,reserveViolations:g2?.reserveViolations??null};
 return {version:VERSION,world,integrity:verify(w),failures,settlements:{...c?.counts,ok:c?.ok,errors:(c?.errors||[]).slice(0,12)},stock:{ok:d?.ok,errors:(d?.errors||[]).slice(0,12)},g2a:{shipments:g2?.shipments,quantity:g2?.quantity,alternativeDonorsUsed:g2?.alternativeDonorsUsed,reserveViolations:g2?.reserveViolations,conservationErrors:g2?.conservationErrors},g3,nations};
 });}finally{if(v32Stats&&w.v32e3OptimizationStats)Object.assign(w.v32e3OptimizationStats,v32Stats);}}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g3','village-observer-v034g2a','village-observer-v034g2','village-observer-v034g1b'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G3A-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G3A-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G3A-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\uFEFF'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};
NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
function download(filename,contents,mime='application/json'){const u=URL.createObjectURL(new Blob([contents],{type:mime})),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const result=prev.apply(this,args);updateUI();return result;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'G3A 런타임 무결성 · 읽기 전용 관측 · 로컬 검증',summary:'G3 공간·구호 밸런스는 유지하며 최초 버전 표시, Hook 자동 진단과 대용량 세이브 로컬 검증을 안정화합니다.',sections:[['배포 및 UI',['G3A 초기 화면 버전 동기화와 물류·공간 Hook/배송 CSV 연결 검사를 제공합니다.','연결 오류는 화면에 명시적으로 경고하며, 배포본 파일은 버전별로 캐시 갱신합니다.']],['관측 안정화',['G3 정책 카운터는 실제 시뮬레이션 판정에서만 증가합니다.','DEVLOG 내보내기·정착지 감사는 관측 전용으로 실행됩니다.']],['로컬 진단',['대용량 세이브 JSON을 외부에 전송하지 않고 브라우저에서 로드·검사·추가 주행합니다.','세계 상태와 RNG를 보존하고 소형 요약 JSON/CSV만 출력합니다.']]]});
NS.V034G3A=Object.freeze({version:VERSION,verify,audit,refresh:updateUI});
// The legacy UI was constructed before D0..G3A bootstraps: refresh immediately.
updateUI();
})(window.VSim);

;
/* H1B2 bundled source: v034g3b.js */
/* V0.34G3B — One-day integration gate (existing pooled stock and G3 split preserved).
 * Integration is allowed only if from core to EVERY member and back costs <=1.00.
 * No new technology, AI, food, money, or military rules.
 */
(function(NS){'use strict';
const VERSION='V0.34G3B',PREV='V0.34G3A',KEY='village-observer-v034g3b',joinLimit=1.00,EPS=1e-8;
const config={enabled:true};
const metrics=new WeakMap();
function counter(w){let m=metrics.get(w);if(!m){m={joinRejectedOverOneDay:0,joinAcceptedWithinOneDay:0};metrics.set(w,m);}return m;}
function onCandidate(w,p){if((p.ar||p.br)&&!p.ac&&!p.bc)counter(w).joinRejectedOverOneDay++;}
function onMerge(w){counter(w).joinAcceptedWithinOneDay++;}
function travelStats(w,ids,core){
 const allowed=new Set((ids||[]).map(Number)),root=Number(core),nodes=new Map();
 if(!allowed.has(root))return {max:null,outboundMax:null,returnMax:null,unreachable:true};
 for(const id of allowed){const t=w.map?.get?.(id),v=w.villages?.find(v=>String(v.id)===String(t?.ownerId)),i=t?.buildings?.indexOf('road')??-1;
  if(!t||!NS.TERRAIN?.[t.terrain]?.passable)return {max:null,outboundMax:null,returnMax:null,unreachable:true};
  const paved=i>=0&&Number(t.buildingCondition?.[i]??100)>=25&&!!v?.hasTech?.('ROADS');
  nodes.set(id,(NS.V034G4?.spatialStep?.(w,t)??(Number(NS.TERRAIN[t.terrain].tradeCost||1)*(paved?.62:1))));
 }
 const sweep=rev=>{const dist=new Map([[root,0]]),queue=[[0,root]];while(queue.length){queue.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const [cost,id]=queue.shift();if(cost>dist.get(id)+EPS)continue;
  for(const n of w.map.neighbors4(id)){if(!allowed.has(n.id))continue;const next=cost+(rev?nodes.get(id):nodes.get(n.id));if(next>=((dist.get(n.id)??Infinity)-EPS))continue;dist.set(n.id,next);queue.push([next,n.id]);}}
  return dist.size===allowed.size?Math.max(...dist.values()):Infinity;};
 const outbound=sweep(false),back=sweep(true),maximum=Math.max(outbound,back);
 return {max:Number.isFinite(maximum)?+maximum.toFixed(5):null,outboundMax:Number.isFinite(outbound)?+outbound.toFixed(5):null,returnMax:Number.isFinite(back)?+back.toFixed(5):null,unreachable:!Number.isFinite(maximum)};
}
function inspect(w){const rows=[],settlements=w.v34b?.settlements||[];let over=0,unreachable=0,grandfathered=0;
 for(const r of settlements){if(r.lifecycle!=='ACTIVE'||!r.tileIds?.length)continue;
  const cost=travelStats(w,r.tileIds,r.coreTileId),tooFar=cost.unreachable||cost.max>joinLimit+EPS;
  if(tooFar)over++;if(cost.unreachable)unreachable++;if(tooFar&&r.v034g3bLegacy)grandfathered++;
  rows.push({id:r.id,nationId:r.nationId,coreTileId:r.coreTileId,tiles:r.tileIds.length,...cost,overOneDay:tooFar,legacy:r.v034g3bLegacy===true});
 }
 rows.sort((a,b)=>((b.max??Infinity)-(a.max??Infinity))||b.tiles-a.tiles||String(a.id).localeCompare(String(b.id)));
 return {joinLimit,activeSettlements:rows.length,overOneDaySettlements:over,unreachableSettlements:unreachable,grandfatheredOverOneDay:grandfathered,maxSettlementTravelCost:rows.length?rows[0].max:0,worstSettlements:rows.filter(x=>x.overOneDay).slice(0,15)};
}
function summary(w,{details=false}={}){const metric={...counter(w)};return details?{...metric,...inspect(w)}:metric;}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g3b={joinLimit,splitPolicy:'G3_PRESERVED',pooledStock:'D3_UNCHANGED',technologyCount:36};return d;};
NS.World.from=function(d){const isOld=d?.version&&d.version!==VERSION;const w=oldFrom(d?.version===VERSION?{...d,version:PREV}:d);
 if(isOld){ // Legacy Settlements are allowed to retain their established D3 pooled stocks.
  for(const r of w.v34b?.settlements||[])if(r.lifecycle==='ACTIVE'&&r.tileIds?.length>1)r.v034g3bLegacy=true;
 }
 return w;
};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){return NS.V034G3.observe(()=>{const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v034g3b={revision:'one-day-join-only',...summary(w,{details:true}),splitPolicy:'G3_PRESERVED',pooledStock:'D3_UNCHANGED',technologyCount:36};return d;});};
function verify(w){const checks={version:NS.RELEASE_VERSION===VERSION,
  joinFixed:Math.abs(joinLimit-1)<EPS,
  g3Spatial:!!NS.V034G3?.config?.spatialEnabled,
  joinedRouteHook:typeof NS.V034C?.canJoin==='function'&&/V034G3B/.test(Function.prototype.toString.call(NS.V034C.canJoin)),
  splitUnchanged:!!NS.V034G3?.policy&&(!w||NS.V034G3.observe(()=>{const r=w.v34b?.settlements?.find(x=>x.lifecycle==='ACTIVE'&&x.tileIds?.length);if(!r)return true;const p=NS.V034G3.policy(w,r.tileIds,r.coreTileId);return Math.abs(p.join-joinLimit)<EPS&&p.split>joinLimit;})),
  g3Food:typeof NS.V034G2A?.relay==='function',
  pooledStock:typeof NS.V034D3?.audit==='function',
  deliveryCsv:!w||NS.V034G2A.csv(w).replace(/^\uFEFF/,'').split(/\r?\n/,1)[0].split(',').length===20};
 return {version:VERSION,build:'g3b-static-v1',ok:Object.values(checks).every(Boolean),tests:checks};}
function audit(w){const base=NS.V034G3A.audit(w),current=NS.V034G3.observe(()=>summary(w,{details:true}));return {...base,version:VERSION,integrity:verify(w),g3b:current};}
function refresh(){try{const w=window.villageObserver?.world,check=verify(w);document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 let notice=document.getElementById('g3aRuntimeIntegrity');if(!notice&&document.body){notice=document.createElement('div');notice.id='g3aRuntimeIntegrity';notice.style.cssText='position:relative;z-index:20;margin:2px auto 7px;max-width:1120px;border-radius:9px;padding:7px 10px;font:12px system-ui,sans-serif;background:#0c1b28';const shell=document.querySelector('.shell'),runtime=document.getElementById('runtimeStatus');if(runtime?.parentNode)runtime.parentNode.insertBefore(notice,runtime.nextSibling);else shell?.prepend?.(notice);}
 if(notice){notice.textContent=check.ok?'✓ G3B 런타임 무결성 · 신규 병합 왕복 1.00 · 기존 분할/공동 재고 유지':'⚠ G3B 런타임 무결성 실패: '+Object.keys(check.tests).filter(k=>!check.tests[k]).join(', ');notice.style.border='1px solid '+(check.ok?'#235a4c':'#a64c39');notice.style.color=check.ok?'#a9e7ca':'#ffe0a1';}
 const btn=document.getElementById('exportG2RelayBtn');if(btn)btn.textContent='G3B 구호 배송 CSV';return check;
 }catch(e){console.error('G3B integrity',e);return {ok:false,error:String(e)};}}
function download(name,data,mime='application/json'){const url=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g3a','village-observer-v034g3','village-observer-v034g2a','village-observer-v034g2','village-observer-v034g1b'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G3B-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G3B-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G3B-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'정착지 병합 왕복 1일 접근성',summary:'신규 병합은 중심지에서 모든 타일로의 왕복 경로가 각각 1.00 이하일 때만 허용하며, 기존 정착지의 공동 재고·기존 분할 여유는 유지합니다.',sections:[['병합 기준',['R2/R3/R4의 병합 이동비 상한을 모두 1.00으로 통일했습니다.','지형·실제 도로·도로 조건·타일 소유권·왕복 방향 검사를 보존하며 90일 대기는 유지합니다.']],['기존 정착지 보호',['구버전 세이브의 기존 대형 정착지는 강제로 분해하지 않으며, 기존 G3 분할 조건과 180일 유예를 유지합니다.','같은 정착지의 민간 재고 즉시 공동 이용은 변경하지 않습니다.']],['진단',['병합 거절/성공 수, 최장 이동비, 1일 접근성을 초과한 기존 정착지를 DEVLOG에 기록합니다.','신규 교통 기술 및 생산·전쟁·구호 밸런스 변경은 없습니다.']]]});
NS.V034G3B=Object.freeze({version:VERSION,joinLimit,config,onCandidate,onMerge,travelStats,inspect,summary,verify,audit,refresh});
// Read-only selected-tile indicator; the stock and path systems are unchanged.
if(NS.UI){const prev=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const result=prev.apply(this,args);
 try{const w=this.world,t=w?.map?.get?.(Number(w.selectedTileId)),box=document.querySelector('.v34c-settlement-tile');if(!t||!box)return result;
  const r=NS.V034C?.byTile?.(w,t.id);if(!r)return result;const d=travelStats(w,r.tileIds,r.coreTileId),old=box.querySelector('.v034g3b-travel-note');if(old)old.remove();
  const node=document.createElement('div');node.className='v034g3b-travel-note small muted';
  node.textContent='G3B 신규 병합 왕복 한도 1.00일 · 이 정착지 최대 접근 '+(d.unreachable?'경로 없음':d.max.toFixed(2)+'일')+(r.v034g3bLegacy?' · 기존 저장 정착지':'')+' · 병합 후 공동 재고 즉시 이용';box.appendChild(node);
 }catch(e){console.warn('G3B tile observer',e);}return result;};}
refresh();
})(window.VSim);

;
/* H1B2 bundled source: v034g4.js */
/* V0.34G4 — Transport Network & Hydraulic Engineering.
 * New roads operate on physical paved tiles. Tier substitution, never multiplicative.
 * G3B bidirectional 1.00 join / legacy split / D3 pooled stocks remain authoritative.
 */
(function(NS){'use strict';
const VERSION='V0.34G4',PREV='V0.34G3B',KEY='village-observer-v034g4',EPS=1e-9;
const ADDED={
 ROAD_IMPROVEMENT:{id:'ROAD_IMPROVEMENT',label:'도로 개량술',icon:'🛣️',cost:650,req:['ROADS','ENGINEERING'],branch:'개척·행정',desc:'도로의 노면·교량을 개량해 실제 도로가 놓인 타일의 민간 이동비를 낮춥니다.',effects:['활성 도로 이동비 0.62 → 0.49','신규 정착지 병합의 1일 기준 유지']},
 POSTAL_NETWORK:{id:'POSTAL_NETWORK',label:'역참 제도',icon:'🐎',cost:850,req:['ROAD_IMPROVEMENT','BUREAUCRACY','FRONTIER_LOGISTICS'],branch:'개척·행정',desc:'역참·정기 운송망으로 실제 도로의 민간 수송 효율을 강화합니다.',effects:['활성 도로 이동비 0.49 → 0.32','도로 미설치 타일에는 효과 없음']},
 HYDRAULIC_ENGINEERING:{id:'HYDRAULIC_ENGINEERING',label:'수리공학',icon:'💧',cost:650,req:['IRRIGATION','ENGINEERING'],branch:'생산',desc:'기존 관개 시설의 용수·수로 관리를 개선해 농업시설을 갖춘 토지의 자연 식량 재생을 증진합니다.',effects:['가동 농업시설의 기본 식량 자연재생 +10%p (합연산)','일반 채취 산출 및 자원 최대치 불변']}
};
for(const [id,t] of Object.entries(ADDED)){NS.TECH[id]=t;if(!NS.TECH_ORDER.includes(id))NS.TECH_ORDER.push(id);}
// Road quality remains a single physical grade. Higher civilian tech replaces its coefficient.
const roadTier=v=>v?.hasTech?.('POSTAL_NETWORK')?3:v?.hasTech?.('ROAD_IMPROVEMENT')?2:v?.hasTech?.('ROADS')?1:0;
const roadFactor=v=>[1,.62,.49,.32][roadTier(v)];
const owner=(w,t)=>w?.villages?.find(v=>String(v.id)===String(t?.ownerId));
function roadCondition(t){if(!t)return 0;let q=0;for(let i=0;i<(t.buildings||[]).length;i++)if(t.buildings[i]==='road')q=Math.max(q,Number(t.buildingCondition?.[i]??100));return q;}
// G3/G3B rule: no benefit unless real road exists and condition >=25.
function spatialStep(w,t){const terrain=NS.TERRAIN?.[t?.terrain];if(!terrain?.passable)return Infinity;const v=owner(w,t);return Number(terrain.tradeCost||1)*(roadCondition(t)>=25?roadFactor(v):1);}
// General civilian land path: retain the historical gradual-condition factor by passing typeEff().
function civilianRoadFactor(w,t,eff){const v=owner(w,t);const quality=Math.max(0,Math.min(1,Number(eff||0)));return 1-(1-roadFactor(v))*quality;}
let activeWorld=null;
function agriculturalEfficiency(t){let best=0;for(let i=0;i<(t?.buildings||[]).length;i++)if(t.buildings[i]==='farmstead'||t.buildings[i]==='ancient_farm'){const c=Number(t.buildingCondition?.[i]??100);best=Math.max(best,c<=0?0:c>=70?1:c/70);}return best;}
function hydraulicBonus(t,dt){if(dt<=0||!t||t.ownerId==null)return 0;const w=t._worldRef||activeWorld,v=owner(w,t);if(!v?.hasTech?.('HYDRAULIC_ENGINEERING'))return 0;const eff=agriculturalEfficiency(t);return Number(NS.TERRAIN?.[t.terrain]?.regen?.food||0)*dt*.10*eff;}
// Readonly telemetry, no RNG or state changes.
function stats(w){const tech={ROADS:0,ROAD_IMPROVEMENT:0,POSTAL_NETWORK:0,HYDRAULIC_ENGINEERING:0},roads={};let cultivated=0,validRoadTiles=0;
 for(const v of w?.villages||[]){for(const k of Object.keys(tech))if(v.hasTech?.(k))tech[k]++;roads[v.id]=roadFactor(v);for(const id of v.territory||[]){const t=w.map?.get?.(Number(id));if(!t)continue;if(roadCondition(t)>=25)validRoadTiles++;if(agriculturalEfficiency(t)>0)cultivated++;}}
 return {tech,roadCoefficientsByNation:roads,validRoadTiles,cultivatedTiles:cultivated,settlementJoinLimit:NS.V034G3B?.joinLimit??null};}
const oldDay=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const previous=activeWorld;activeWorld=this;try{return oldDay.apply(this,args);}finally{activeWorld=previous;}};
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g4={revision:'road-tier-substitution-hydraulic',techCount:39,roadFactors:[.62,.49,.32],oneDayJoin:true};return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v034g4={revision:'physical-civilian-road-tier-and-irrigated-regen',...stats(w)};d.worldSummary.techCount=NS.TECH_ORDER.length;d.worldSummary.roadModel='physical road single grade; nation technology substitutes 0.62 / 0.49 / 0.32 for civilian paths';return d;};
const prevChoose=NS.TechSystem.choose;
NS.TechSystem.choose=function(v,w){const base=prevChoose.call(this,v,w),available=this.available(v);if(!available?.length)return base;let roadCount=0,farmCount=0;for(const id of v.territory||[]){const t=w.map.get(Number(id));if(!t)continue;if(roadCondition(t)>=25)roadCount++;if(agriculturalEfficiency(t)>0)farmCount++;}
 const spread=(v.territory?.size||0),pop=Number(v.population?.()||0),days=Number(v.foodReserveDays?.()||0),trait=Number(NS.V033F5A6?.profileFor?.(v)?.traits?.production??1);
 if(available.includes('HYDRAULIC_ENGINEERING')&&farmCount>0&&(days<28||days<55&&farmCount>=2))return 'HYDRAULIC_ENGINEERING';
 if(available.includes('ROAD_IMPROVEMENT')&&roadCount>=3&&(spread>=8||pop>=35))return 'ROAD_IMPROVEMENT';
 if(available.includes('POSTAL_NETWORK')&&roadCount>=5&&spread>=12)return 'POSTAL_NETWORK';
 return base;};
function verify(w){const tests={version:[VERSION,'V0.34G4A1'].includes(NS.RELEASE_VERSION),techCount:NS.TECH_ORDER.length===39,newTechs:Object.keys(ADDED).every(k=>NS.TECH_ORDER.includes(k)),joinLimit:Math.abs(NS.V034G3B?.joinLimit-1)<EPS,splitPreserved:!!NS.V034G3?.policy,pooledStock:!!NS.V034D3?.audit,roadFactors:roadFactor({hasTech:k=>['ROADS','ROAD_IMPROVEMENT','POSTAL_NETWORK'].includes(k)})===.32,hydraulicFunction:typeof hydraulicBonus==='function'};return{version:VERSION,build:'g4-v1',ok:Object.values(tests).every(Boolean),tests};}
function audit(w){const a=NS.V034G3B.audit(w);return{...a,version:VERSION,integrity:verify(w),g4:stats(w)};}
function refresh(){try{const w=window.villageObserver?.world,c=verify(w);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.setAttribute('data-runtime-version',VERSION);}
 let n=document.getElementById('g3aRuntimeIntegrity');if(n){n.textContent=c.ok?'✓ G4 런타임 · 기술 39개 · 도로 0.62/0.49/0.32 · 병합 왕복 1일 유지':'⚠ G4 무결성: '+Object.keys(c.tests).filter(k=>!c.tests[k]).join(', ');n.style.border='1px solid '+(c.ok?'#235a4c':'#a64c39');n.style.color=c.ok?'#a9e7ca':'#ffe0a1';}return c;}catch(e){return{ok:false,error:String(e)};}}
function download(name,data,mime='application/json'){const u=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g3b','village-observer-v034g3a','village-observer-v034g3','village-observer-v034g2a'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G4-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G4-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G4-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-17',title:'도로 개량술·역참 제도·수리공학',summary:'기술 36→39개. 실제 도로를 기반으로 민간 이동비를 0.62/0.49/0.32로 대체하고, 가동 중인 농업시설의 자연 식량 회복을 기본량 기준 +10%p 높입니다.',sections:[['기술 트리',['도로 개량술(도로+토목술, 650K), 역참 제도(도로 개량술+관료제+개척 보급술, 850K), 수리공학(관개·윤작+토목술, 650K)을 추가합니다.']],['도로와 정착지',['기술 계수는 누적 곱하지 않고 최고 기술의 계수로 대체하며, 실제 도로와 도로 상태를 반영합니다.','G3B 신규 병합 왕복 1일 기준, 기존 정착지 보호·분할·공동 재고는 유지합니다.','군사 이동 공식은 변경하지 않습니다.']],['농업',['가동 중인 농업시설에서만 기본 자연 식량 재생의 10%p를 합연산으로 추가합니다.','농부 개인 산출량·식량 저장 한도·재고 보존 기준은 변경하지 않습니다.']]]});
NS.V034G4=Object.freeze({version:VERSION,techs:ADDED,roadTier,roadFactor,roadCondition,spatialStep,civilianRoadFactor,hydraulicBonus,stats,verify,audit,refresh});
if(NS.UI){const header=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=header.apply(this,args);refresh();return r;};}
if(NS.UI){const old=NS.UI.prototype.renderTile;NS.UI.prototype.renderTile=function(...args){const r=old.apply(this,args);try{const box=document.querySelector('.v34c-settlement-tile');if(box){const x=box.querySelector('.v034g3b-travel-note');if(x)x.textContent=x.textContent.replace('G3B 신규 병합','G4 신규 병합');}}catch{}return r;};}
refresh();
})(window.VSim);

;
/* H1B2 bundled source: v034g4a.js */
/* Village Observer V0.34G4A — Food & Hunger Balance Only.
 * No additional food logistics, welfare, migration, occupation or economic subsystem.
 * The 12-calendar-day Hunger=100 fatality gate and physical stock rules are unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.34G4A',PREV='V0.34G4',KEY='village-observer-v034g4a';
const CONFIG=Object.freeze({childFoodNeed:.28,adultFoodNeed:.39,priorChildNeed:.30,priorAdultNeed:.42,shortfallHungerGainReduction:.15,highHungerRecoveryBonus:.10,highHungerRecoveryStart:70,starvationGraceDays:12});
const cap=(x,a,b)=>Math.max(a,Math.min(b,Number(x)||0));
// At full ration, original work/rest Hunger gain is exactly preserved.
// With short rations, Hunger still grows, just modestly more slowly.
function hungerGain(gain,ratio){return Math.max(0,Number(gain)||0)*(1-CONFIG.shortfallHungerGainReduction*(1-cap(ratio,0,1)));}
// No food => zero recovery, as before. Higher Hunger modestly increases effectiveness of real rations.
function reliefFactor(hunger){return 1+CONFIG.highHungerRecoveryBonus*cap((Number(hunger)-CONFIG.highHungerRecoveryStart)/(100-CONFIG.highHungerRecoveryStart),0,1);}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=oldSerialize.call(this);d.version=VERSION;d.v034g4a={balance:'FOOD_HUNGER_NUMERIC_V1',...CONFIG};return d;};
NS.World.from=function(d){return oldFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v034g4a={balance:'FOOD_HUNGER_NUMERIC_V1',...CONFIG};return d;};
const oldG4Verify=NS.V034G4.verify;
function verify(w){const g4=oldG4Verify(w),tests={...g4.tests,version:[VERSION,'V0.34G4A1'].includes(NS.RELEASE_VERSION),
  foodNeed:Math.abs(NS.V034F0.needFor({age:10})-.28)<1e-8&&Math.abs(NS.V034F0.needFor({age:35})-.39)<1e-8,
  fullMealGain:Math.abs(hungerGain(6,1)-6)<1e-8,
  shortMealGain:Math.abs(hungerGain(6,0)-5.1)<1e-8,
  normalRecovery:reliefFactor(60)===1,highRecovery:Math.abs(reliefFactor(100)-1.1)<1e-8,
  starvationGrace:CONFIG.starvationGraceDays===12&&typeof NS.V034F2?.dailyStarvation==='function'};
 return {version:VERSION,build:'g4a-v1',ok:Object.values(tests).every(Boolean),tests};}
function audit(w){const a=NS.V034G3B.audit(w);return{...a,version:VERSION,integrity:verify(w),g4:NS.V034G4.stats(w),g4a:{...CONFIG}};}
function download(name,data,mime='application/json'){const u=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...NS.SaveSystem,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g4','village-observer-v034g3b','village-observer-v034g3a','village-observer-v034g3'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){download('village-observer-v034G4A-save-'+w.year+'y.json',JSON.stringify(w.serialize()));},
 exportDevJSON(w){download('village-observer-v034G4A-devlog-'+w.telemetry.sessionId+'.json',JSON.stringify(w.telemetry.toJSON(w)));},
 exportG2Routes(w){download('village-observer-v034G4A-relay-routes-'+(w.telemetry?.sessionId||'session')+'.csv','\ufeff'+NS.V034G2A.csv(w),'text/csv;charset=utf-8');}
};NS.SaveSystem.exportG2ARoutes=NS.SaveSystem.exportG2Routes;
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'식량·허기 수치 밸런스',summary:'신규 구호 메커니즘 없이 기존 3일 배급 수요를 약 7% 줄이고, 식량 부족 시 Hunger 누적을 일부 완화하며, 심각한 Hunger에 실제 식사로 회복하는 효과를 약간 높입니다.',sections:[['식량 수요',['아동 3일 수요 0.30→0.28, 성인 0.42→0.39. 군인 1.09배·정착지별 공동 실물 배급은 유지합니다.','기존 식량 생산·자연 회복·시설·기술 보너스·정착지 물류에 추가 변경이 없습니다.']],['허기',['정상 배급 시 기존 Hunger 증가식을 그대로 유지합니다.','부족한 배급의 비율에 따라 Hunger 증가량을 최대 15% 완화합니다. 식량이 없으면 Hunger는 여전히 증가합니다.','식사 직전 Hunger 70 초과부터 실제 식량을 먹었을 때의 회복량이 최대 10% 높아집니다. 식량을 먹지 못하면 회복하지 않습니다.']],['보존 및 범위',['Hunger=100 유지 12달력일 기아 사망 판정은 그대로 유지합니다.','F3 Health 및 Happiness, 군사·AI·경제·기술·국가 간 물류와 물리 재고·Gold 보존식은 수정하지 않습니다.']]]});
function refresh(){const check=verify(window.villageObserver?.world);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 const status=document.getElementById('g3aRuntimeIntegrity');if(status){status.textContent=check.ok?'✓ G4A 런타임 · 식량·허기 수치 조정 · 물리 재고/12일 유예 유지':'⚠ G4A 무결성: '+Object.keys(check.tests).filter(k=>!check.tests[k]).join(', ');status.style.color=check.ok?'#a9e7ca':'#ffe0a1';status.style.border='1px solid '+(check.ok?'#235a4c':'#a64c39');}}
 return check;}
NS.V034G4A=Object.freeze({version:VERSION,config:CONFIG,hungerGain,reliefFactor,verify,audit,refresh});
if(NS.UI){const prior=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=prior.apply(this,args);refresh();return r;};}
refresh();
})(window.VSim);

;
/* H1B2 bundled source: v034g4a1.js */
/* V0.34G4A1 — Statistics dropdown DOM stability hotfix.
 * Only UI option text stability and release identity; no simulation rules changed.
 * The G1 bootstrapping layer now compares the caption before mutating option.textContent.
 * F5A1 continues to defer statistics redraw while the select is active.
 */
(function(NS){'use strict';
const VERSION='V0.34G4A1',PREV='V0.34G4A',KEY='village-observer-v034g4a1';
const previousSerialize=NS.World.prototype.serialize,previousFrom=NS.World.from;
NS.World.prototype.serialize=function(){const d=previousSerialize.call(this);d.version=VERSION;d.v034g4a1={revision:'stats-dropdown-option-dom-stability',simulationUnchanged:true};return d;};
NS.World.from=function(d){return previousFrom(d?.version===VERSION?{...d,version:PREV}:d);};
const jsonPrev=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=jsonPrev.call(this,w);d.version=VERSION;d.worldSummary.v034g4a1={revision:'stats-dropdown-option-dom-stability',simulationUnchanged:true,statsSelectorsProtected:true};return d;};
function verify(w){const parent=NS.V034G4A.verify(w),t={...parent.tests,version:NS.RELEASE_VERSION===VERSION,statsCaption:typeof document==='undefined'||document.getElementById('statsScope')?.querySelector('option[value="settlement"]')?.textContent==='타일 (기존 장기 통계)'};
return {version:VERSION,ok:Object.values(t).every(Boolean),tests:t};}
function audit(w){return{...NS.V034G4A.audit(w),version:VERSION,integrity:verify(w)};}
function status(){const c=verify(window.villageObserver?.world);if(typeof document!=='undefined'){
 document.title='Village Observer '+VERSION;
 const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.setAttribute('data-runtime-version',VERSION);}
 const x=document.getElementById('g3aRuntimeIntegrity');if(x){x.textContent=c.ok?'✓ G4A1 런타임 · G4A 밸런스 유지 · 통계 드롭다운 안정화':'⚠ G4A1 무결성: '+Object.keys(c.tests).filter(k=>!c.tests[k]).join(', ');x.style.color=c.ok?'#a9e7ca':'#ffe0a1';x.style.border='1px solid '+(c.ok?'#235a4c':'#a64c39');}}
 return c;}
const priorSave=NS.SaveSystem;
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const raw=[KEY,'village-observer-v034g4a','village-observer-v034g4','village-observer-v034g3b','village-observer-v034g3a','village-observer-v034g3'].map(k=>localStorage.getItem(k)).find(Boolean);return raw?NS.World.from(JSON.parse(raw)):null;},
 export(w){const data=JSON.stringify(w.serialize()),a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.href=u;a.download=`village-observer-v034G4A1-save-${w.year}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);},
 exportDevJSON(w){const data=JSON.stringify(w.telemetry.toJSON(w)),a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.href=u;a.download=`village-observer-v034G4A1-devlog-${w.telemetry.sessionId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'통계 범주 드롭다운 새로고침 수정',summary:'게임 진행 중 세계/국가/타일(기존 장기 통계) 드롭다운이 다시 만들어져 닫히는 UI 문제를 해결합니다. 식량·허기 밸런스와 시뮬레이션은 G4A와 같습니다.',sections:[['통계 화면',['G1 용어 교체 코드가 매 프레임 같은 option.textContent를 다시 할당하던 회귀를 수정했습니다.','드롭다운이 열린 동안 옵션 DOM을 변경하지 않고, 사용자가 실제로 값을 바꿀 때만 갱신합니다.','세계·국가·타일(기존 장기 통계) 선택값과 차트 기능은 보존합니다.']],['규칙·세이브',['G4A의 식량 수요 0.28/0.39, 허기 변화, G4 기술 39개, G3B 병합 1일 기준, 군사·AI·RNG·회계 규칙은 변경하지 않았습니다.','G4A 등 이전 세이브를 불러올 수 있으며 G4A1 저장 형식은 별도 버전명을 사용합니다.']]]});
NS.V034G4A1=Object.freeze({version:VERSION,verify,audit,refresh:status});
if(NS.UI){const old=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...args){const r=old.apply(this,args);status();return r;};}
status();
})(window.VSim);

;
/* H1B2 bundled source: v034g5.js */
/* V0.34G5 — Specialized Labor & Field Recovery.
   4 techs, no new jobs/stock/state machine. All Person/physical stock and 1-day G3B rules retained. */
(function(NS){'use strict';
const VERSION='V0.34G5',PREV='V0.34G4A1',KEY='village-observer-v034g5';
const ADDED={
 INTENSIVE_FARMING:{id:'INTENSIVE_FARMING',label:'집약 농법',icon:'🌾',cost:700,req:['HYDRAULIC_ENGINEERING','GRANARY'],branch:'생산',desc:'농부의 실제 수확 효율을 개선합니다. 농업시설의 자연 재생을 높이는 수리공학과는 다른 효과입니다.',effects:['농부 식량 생산 배율 +0.12 (합연산)','채집꾼·사냥꾼 제외, 자연 식량·저장 한도 유지']},
 MINING_TECHNIQUES:{id:'MINING_TECHNIQUES',label:'채굴 공법',icon:'⛏️',cost:700,req:['IRON_MINING','ENGINEERING'],branch:'생산',desc:'석재·철광석을 채굴하는 광부의 효율을 개선합니다. 제련과 도구 제작은 그대로입니다.',effects:['광부 석재 산출 배율 +0.12 (합연산)','철광산 채굴 목표량 +12%p, 실제 광맥·창고 한도 준수']},
 SYSTEMATIC_RESEARCH:{id:'SYSTEMATIC_RESEARCH',label:'체계적 연구법',icon:'📚',cost:850,req:['ACADEMY','EDUCATION'],branch:'지식',desc:'학당에서 근무하는 실제 학자의 체계적 연구 역량을 강화합니다.',effects:['학당 학자 Knowledge 직업 산출 +15%p (학당 보정 1.20 → 1.35)','기존 국가 Knowledge 계수 및 다른 직업 불변']},
 FIELD_REORGANIZATION:{id:'FIELD_REORGANIZATION',label:'야전 재편술',icon:'🎖️',cost:750,req:['MILITARY_LOGISTICS','BUREAUCRACY'],branch:'군사',desc:'Formation의 전투 후 사기·재집결·작전 복귀를 더 빠르게 합니다.',effects:['전투 후 Formation 사기 회복 속도 +20%','신규 Regroup 기간 약 15% 감소','신규 전투 후 작전 복귀 기간 약 15% 감소','Person 부상·사망·장비 및 군수 규칙 불변']}
};
for(const [k,v] of Object.entries(ADDED)){NS.TECH[k]=v;if(!NS.TECH_ORDER.includes(k))NS.TECH_ORDER.push(k);}
const counters={farmerWorks:0,stoneMinerWorks:0,oreMinerWorks:0,scholarWorks:0,regroupsDiscounted:0,postBattleDiscounted:0};
function workerMultiplier(p,v,kind,t,base){let add=0;if(p?.alive&&p.age>=15&&p.assignment!=='PIONEER'){
 if(kind==='food'&&p.job==='농부'&&v?.hasTech?.('INTENSIVE_FARMING')){add=.12;counters.farmerWorks++;}
 else if(kind==='stone'&&p.job==='광부'&&v?.hasTech?.('MINING_TECHNIQUES')){add=.12;counters.stoneMinerWorks++;}
 }return Math.max(0,Number(base||0))+add;
}
function oreMultiplier(v,base){if(v?.hasTech?.('MINING_TECHNIQUES')){counters.oreMinerWorks++;return Number(base||0)+.12;}return Number(base||0);}
function scholarMultiplier(v){if(v?.hasTech?.('SYSTEMATIC_RESEARCH')){counters.scholarWorks++;return 1.35;}return 1.20;}
function regroupDays(v,d){const days=Number(d)||0;if(v?.hasTech?.('FIELD_REORGANIZATION')){counters.regroupsDiscounted++;return Math.max(1,Math.round(days*.85));}return days;}
function postBattleDays(v,d){const days=Number(d)||0;if(v?.hasTech?.('FIELD_REORGANIZATION')){counters.postBattleDiscounted++;return Math.max(1,Math.round(days*.85));}return days;}
const choose=NS.TechSystem.choose;
NS.TechSystem.choose=function(v,w){const fallback=choose.call(this,v,w),choices=this.available(v);if(!choices?.length)return fallback;
 const pop=Number(v.population?.()||0),people=v.residents||[],living=people.filter(p=>p.alive&&p.age>=15&&p.assignment!=='PIONEER'),count=k=>living.filter(p=>p.job===k).length,farms=count('농부'),miners=count('광부'),scholars=count('학자');
 if(choices.includes('INTENSIVE_FARMING')&&farms>=Math.max(2,pop*.10)&&Number(v.foodReserveDays?.()||0)<65)return 'INTENSIVE_FARMING';
 if(choices.includes('MINING_TECHNIQUES')&&miners>=2)return 'MINING_TECHNIQUES';
 if(choices.includes('SYSTEMATIC_RESEARCH')&&scholars>=2)return 'SYSTEMATIC_RESEARCH';
 const war=!!NS.V033?.warForNation?.(w,v.id),morale=(v.military32A?.formations||[]).some(f=>Number(f.v33c1BattleMorale||0)<-5||f.status==='REGROUPING');
 if(choices.includes('FIELD_REORGANIZATION')&&(war||morale))return 'FIELD_REORGANIZATION';
 return fallback;
};
const oldSave=NS.World.prototype.serialize,oldFrom=NS.World.from;
NS.World.prototype.serialize=function(){const s=oldSave.call(this);s.version=VERSION;s.v034g5={revision:'specialized-labor-formation-recovery',techCount:43};return s;};
NS.World.from=function(s){return oldFrom(s?.version===VERSION?{...s,version:PREV}:s);};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const d=oldJSON.call(this,w);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.techCount=NS.TECH_ORDER.length;d.worldSummary.v034g5={revision:'specialized-labor-formation-recovery',technologies:Object.keys(ADDED).reduce((a,k)=>(a[k]=(w?.activeVillages||[]).filter(v=>v.hasTech?.(k)).length,a),{}),counters:{...counters},physicalStockPreserved:true};return d;};
function verify(w){const prev=NS.V034G4A1.verify(w),t={...prev.tests,version:(NS.RELEASE_VERSION===VERSION||(NS.RELEASE_VERSION==='V0.34H0'||(NS.RELEASE_VERSION==='V0.34H1'||NS.RELEASE_VERSION==='V0.34H2'||NS.RELEASE_VERSION==='V0.34H2A'||NS.RELEASE_VERSION==='V0.34H3'||NS.RELEASE_VERSION==='V0.34H4'||NS.RELEASE_VERSION==='V0.34H4A'||NS.RELEASE_VERSION==='V0.34H4B'||NS.RELEASE_VERSION==='V0.34H4C'||NS.RELEASE_VERSION==='V0.35A'||NS.RELEASE_VERSION==='V0.35B'))),statsCaption:typeof document==='undefined'||!document.getElementById('statsScope')||document.getElementById('statsScope')?.querySelector('option[value="settlement"]')?.textContent==='타일 (기존 장기 통계)',techCount:NS.TECH_ORDER.length===43,newTechs:Object.keys(ADDED).every(k=>NS.TECH_ORDER.includes(k)),additiveFarmer:typeof workerMultiplier==='function'&&typeof oreMultiplier==='function'&&typeof scholarMultiplier==='function',regroupRecovery:Math.round(20*.85)===17};return{version:VERSION,ok:Object.values(t).every(Boolean),tests:t};}
function audit(w){const r=NS.V034G4A1.audit(w);return{...r,version:VERSION,integrity:verify(w)};}
function status(){const w=window.villageObserver?.world,r=verify(w);document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.setAttribute('data-runtime-version',VERSION);}const s=document.getElementById('g3aRuntimeIntegrity');if(s){s.textContent=r.ok?'✓ G5 · 기술 43개 · 직업 생산/Formation 회복 · G4A1 안정성 유지':'⚠ G5: '+Object.keys(r.tests).filter(k=>!r.tests[k]).join(', ');s.style.color=r.ok?'#a9e7ca':'#ffe0a1';}return r;}
const prior=NS.SaveSystem;
function download(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...prior,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const keys=[KEY,'village-observer-v034g4a1','village-observer-v034g4a','village-observer-v034g4','village-observer-v034g3b'];for(const k of keys){const raw=localStorage.getItem(k);if(raw)return NS.World.from(JSON.parse(raw));}return null;},
 export(w){download(`village-observer-v034G5-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034G5-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(t=>t.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'직업 생산성·야전 재편술',summary:'기술 39→43개. 농부·광부·학자의 합연산 생산 보너스와 Formation 전투 후 사기·Regroup·작전복귀 단축. G4A1 허기·통계 UI 안정성 유지.',sections:[['새 기술',['집약 농법 700K: 수리공학 + 곡물 저장·보존 / 농부 식량 +12%p','채굴 공법 700K: 철광 채굴 + 공학 / 광부 석재·철광석 +12%p','체계적 연구법 850K: 학당 + 교육제도 / 학당 학자 Knowledge +15%p','야전 재편술 750K: 군수 행정 + 관료제 / Formation 회복 +20%, 재집결·전투 후 대기 약 15% 단축']],['수치와 회계',['개별 직업 산출에만 보너스를 적용하고 국가 기술 간 보너스를 누적 곱하지 않습니다.','석재는 원래 D3A 채취·저장·자연복원 경로를 유지하며 철광산 채굴은 광맥·실제 저장 한도를 유지합니다.','Person 부상 회복, 사망, 군사 이동, 사상자와 장비 소모를 변경하지 않습니다.']],['호환',['G4A1 식량 수요 및 Hunger 수치, G4 도로 계수·수리공학, G3B 신규 병합 왕복 1일, 기존 정착지 공동 재고 및 통계 드롭다운 안정성을 보존합니다.']]]});
NS.V034G5=Object.freeze({version:VERSION,techs:ADDED,workerMultiplier,oreMultiplier,scholarMultiplier,regroupDays,postBattleDays,verify,audit,refresh:status,counters});
if(NS.UI){const head=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const x=head.apply(this,a);status();return x;};}
status();
})(window.VSim);

;
/* H1B2 bundled source: v034h0.js */
/* Village Observer V0.34H0 — verified UI-refactor boundary.
 * Compatibility: H0 and G5/G4A1/G4A/G4/G3B worlds only (current G5 supported chain).
 * No Person, production, AI, battle, RNG, time, F0/F1, or telemetry snapshot changes.
 */
(function(NS){'use strict';
const VERSION='V0.34H0',PREVIOUS='V0.34G5',KEY='village-observer-v034h0';
const priorSerialize=NS.World.prototype.serialize,priorFrom=NS.World.from;
NS.World.prototype.serialize=function(...a){const d=priorSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(data,...a){return priorFrom.call(this,data?.version===VERSION?{...data,version:PREVIOUS}:data,...a);};
const priorJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(...a){const d=priorJSON.apply(this,a);d.version=VERSION;return d;};
const priorSave=NS.SaveSystem;
function download(name,obj){const url=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},
 load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):priorSave.load?.();},
 export(w){download(`village-observer-v034H0-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034H0-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
// The following small, optional helpers are shared by H1-H3; H0 does not change panel DOM.
const ui=Object.freeze({
 byId:id=>typeof document==='undefined'?null:document.getElementById(id),
 setExpanded(node,expanded){if(!node)return false;node.hidden=!expanded;node.setAttribute?.('aria-hidden',expanded?'false':'true');return true;},
 isExpanded:node=>!!node&&!node.hidden,
 // Return a status snapshot without assuming that a G5 component check audits the whole world.
 integrity:()=>NS.V034G5.verify(window.villageObserver?.world)
});
NS.RELEASE_VERSION=VERSION;
function refresh(){
 if(typeof document==='undefined')return;
 document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');
 if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}
 // Old release success text is not a real error channel. Retain its DOM anchor for F0 layout.
 const old=document.getElementById('runtimeStatus');if(old){old.hidden=true;old.style.display='none';}
 const notice=document.getElementById('g3aRuntimeIntegrity');
 if(notice){const r=NS.V034G5.verify(window.villageObserver?.world);notice.hidden=!!r.ok;notice.style.display=r.ok?'none':'';
  if(!r.ok){notice.textContent='⚠ H0 구성 무결성: '+Object.keys(r.tests).filter(k=>!r.tests[k]).join(', ');notice.setAttribute?.('role','alert');}}
}
NS.V034H0=Object.freeze({version:VERSION,verify:()=>NS.V034G5.verify(window.villageObserver?.world),audit:w=>NS.V034G5.audit(w),compatibility:['V0.34H0','V0.34G5','V0.34G4A1','V0.34G4A','V0.34G4','V0.34G3B'],ui,refresh});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'UI 개편 기반 · 레거시 경계 정리',summary:'C1G 고정 성공 문구를 제거하고 정상 무결성 알림을 숨깁니다. H1~H3 UI 통합을 위한 공통 인터페이스·회귀 기준을 추가했습니다. 게임 로직과 F0/F1 계측은 G5 그대로입니다.',sections:[['이번 버전',['구형 C1G 성공 문구 제거; 기존 실제 연간 진단/계측은 유지','상단 정상 상태 알림을 숨기고 검사 실패 경고는 계속 표시','후속 UI 개편을 위한 확장용 인터페이스 및 의존성 감사 추가']],['호환성',['V0.34 계열 G5/G4A1/G4A/G4/G3B 저장파일 로드 유지','V0.33 이하 세이브 지원은 보장하지 않음','기술 43개·Person·AI·군사·Gold·물리 재고·RNG·F0/F1·CSV 스키마 변경 없음']]]});
if(NS.UI){const prev=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const result=prev.apply(this,a);refresh();return result;};}
refresh();
})(window.VSim);

;
/* H1B2 bundled source: v034h1.js */
/* V0.34H1 — Map UI & Settlement Visualization V2
 * Presentation-only: map geometry, controls, and inspector composition.
 * The Settlement ledger and all production, combat, AI, RNG, telemetry and F0/F1
 * calculations remain owned by the G5/H0 engines.
 */
(function(NS){'use strict';
const VERSION='V0.34H1',PREVIOUS='V0.34H0',KEY='village-observer-v034h1';
const P=NS.UI?.prototype;
const equal=(a,b)=>String(a)===String(b);
const terrain=t=>NS.TERRAIN?.[t?.terrain]?.label||t?.terrain||'미확인';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeNum=v=>Number.isFinite(Number(v))?Number(v):0;
const settlements=w=>(w?.v34b?.settlements||[]).filter(s=>s.lifecycle==='ACTIVE'&&s.tileIds?.length);
const nationColor=(owner)=>{const pal=NS.NATION_COLORS||['#62a8ff','#74d69c','#ff8b91','#bd9cff'];const id=Number(owner);return pal[(id%pal.length+pal.length)%pal.length]||pal[0];};
function colorFor(t){const base=nationColor(t.ownerId);const v=String(t.settlementId||'').split('').reduce((n,ch)=>(n*33+ch.charCodeAt(0))>>>0,5381);
 // Small stable light/dark change per Settlement; retain the nation's hue.
 if(/^#[0-9a-f]{6}$/i.test(base)){const shift=(v%3-1)*11;const raw=[1,3,5].map(i=>Math.max(22,Math.min(246,parseInt(base.slice(i,i+2),16)+shift)));return '#'+raw.map(n=>n.toString(16).padStart(2,'0')).join('');}
 return base;
}
function boundaryGeometry(w){
 const entries=[],groups=new Map(),map=w.map;
 for(const t of map.tiles){if(t.ownerId==null||t.settlementId==null)continue;
  const sid=String(t.settlementId),nation=String(t.ownerId);let r=groups.get(sid);
  if(!r){r={sid,nation,color:colorFor(t),tiles:[],edges:[],core:null};groups.set(sid,r);}
  r.tiles.push([t.x,t.y]);
  for(const [dx,dy,x1,y1,x2,y2] of [[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]){
   const n=map.at(t.x+dx,t.y+dy);
   if(!n||n.ownerId==null||!equal(n.ownerId,t.ownerId)||String(n.settlementId)!==sid)
    r.edges.push([t.x+x1,t.y+y1,t.x+x2,t.y+y2]);
  }
 }
 for(const s of settlements(w)){const r=groups.get(String(s.id));if(r)r.core=Number(s.coreTileId);}
 return [...groups.values()];
}
function geometryFor(w){const c=w.v34c?.counters||{},sig=[w.map?.tiles?.length,c.ownershipChanges,c.merges,c.splits].join(':');
 // All topology mutations in the C engine advance at least one of these counters.
 if(w._v034h1Borders?.signature===sig)return w._v034h1Borders.groups;
 const groups=boundaryGeometry(w);
 Object.defineProperty(w,'_v034h1Borders',{configurable:true,enumerable:false,writable:true,value:{signature:sig,groups}});
 return groups;
}
function invalidate(w){if(w&&Object.prototype.hasOwnProperty.call(w,'_v034h1Borders'))delete w._v034h1Borders;}
function selectedId(ui){const t=ui.world?.map?.get(ui.world.selectedTileId);return t?.ownerId!=null&&t?.settlementId!=null?String(t.settlementId):null;}
function drawBoundaries(ui){const w=ui.world,mode=ui.h1BoundaryMode||'all',geo=ui._mapGeom,c=ui.q?.('worldCanvas');if(!w||!geo||!c||mode==='off')return;
 const selected=selectedId(ui),groups=geometryFor(w),{cell,ox,oy}=geo,ctx=c.getContext('2d');if(!ctx||!cell)return;
 ctx.save();ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);ctx.clip();
 if(mode==='selected'&&selected){
  // Dim the full map OUTSIDE the selected Settlement (including neutral land and water).
  // Even-odd fill leaves the actual member tiles untouched; never clear map pixels.
  const chosen=groups.find(g=>g.sid===selected);
  if(chosen){ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);
   for(const [x,y] of chosen.tiles)ctx.rect(ox+x*cell,oy+y*cell,cell,cell);
   ctx.fillStyle='rgba(8,16,29,.32)';ctx.fill('evenodd');}
 }
 for(const g of groups){const active=mode==='all'||g.sid===selected;
  if(!active)continue;
  ctx.fillStyle=g.color;ctx.globalAlpha=mode==='selected'?.19:.105;
  for(const [x,y] of g.tiles)ctx.fillRect(ox+x*cell,oy+y*cell,cell,cell);
 }
 ctx.globalAlpha=1;
 for(const g of groups){const active=mode==='all'||g.sid===selected;
  if(mode==='selected'&&!active)continue;
  const baseWidth=Math.max(mode==='selected'?2.2:1.6,cell*(mode==='selected'?.105:.075));const width=mode==='all'?baseWidth*.70:baseWidth;
  function trace(){ctx.beginPath();for(const [x1,y1,x2,y2] of g.edges){ctx.moveTo(ox+x1*cell,oy+y1*cell);ctx.lineTo(ox+x2*cell,oy+y2*cell);}}
  ctx.lineJoin='round';ctx.lineCap='square';
  trace();ctx.strokeStyle='rgba(7,17,26,.92)';ctx.lineWidth=mode==='all'?(baseWidth+2.1)*.70:width+2.1;ctx.stroke();
  trace();ctx.strokeStyle=g.color;ctx.lineWidth=width;ctx.stroke();
  if(mode==='selected'&&active&&g.core!=null){const t=w.map.get(g.core);if(t){ctx.beginPath();ctx.arc(ox+(t.x+.5)*cell,oy+(t.y+.5)*cell,Math.max(2.5,cell*.105),0,Math.PI*2);ctx.fillStyle='#fff5cf';ctx.fill();ctx.strokeStyle='#172d40';ctx.lineWidth=1.9;ctx.stroke();}}
 }
 ctx.restore();
}
function installControls(ui){if(typeof document==='undefined')return;const bar=document.querySelector('#view-map .map-toolbar');if(!bar)return;
 document.getElementById('v34cBoundaryToggle')?.remove();
 const layer=ui.q?.('v15LayerSelect');if(layer){layer.querySelector('option[value="lifezone"]')?.remove();if(layer.value==='lifezone'||ui.mapLayer==='lifezone'){ui.mapLayer='base';layer.value='base';}}
 let sel=document.getElementById('h1SettlementBoundary');if(!sel){const label=document.createElement('label');label.className='h1-boundary-setting';label.textContent='정착지 경계 ';sel=document.createElement('select');sel.id='h1SettlementBoundary';sel.setAttribute('aria-label','정착지 경계 표시');sel.innerHTML='<option value="off">끔</option><option value="all">전체</option><option value="selected">선택 강조</option>';label.appendChild(sel);bar.appendChild(label);
  sel.addEventListener('change',()=>{const instance=window.villageObserver;if(!instance)return;instance.h1BoundaryMode=sel.value;instance.renderMap?.();});}
 sel.value=ui.h1BoundaryMode||'all';
 // Filters belong only to the corresponding layer; do not alter their legacy business logic.
 for(const el of bar.querySelectorAll('select')){if(el.id==='h1SettlementBoundary'||el.id==='v15LayerSelect'||el.id==='v32dMapStyle')continue;
  const id=el.id.toLowerCase();const overlay=ui.mapLayer||'base';if(/trade|flow|resource|good|item|partner/.test(id))el.style.display=(overlay.includes('trade')||overlay.includes('logistic')||overlay.includes('resource'))?'':'none';}
}
function updateStats(ui){const w=ui.world,root=ui.q?.('globalStats');if(!root||!w)return;
 const rows=[['인구',w.allPeople?.length||0],['국가',w.activeNations?.length||0],['정착지',settlements(w).length],['영토 타일',w.map.tiles.filter(t=>t.ownerId!=null).length],['국가 국고 합계',`${(w.activeNations||[]).reduce((n,v)=>n+safeNum(v.gold),0).toFixed(0)} G`]];
 const sig=rows.map(x=>x.join(':')).join('|');if(root.dataset.h1Stats===sig)return;root.dataset.h1Stats=sig;
 root.innerHTML=rows.map(([label,val])=>`<div class="stat"><div class="label">${label}</div><div class="value">${val}</div></div>`).join('');
}
function categorizeTile(ui){const root=ui.q?.('tileInspector'),w=ui.world,t=w?.map?.get(w.selectedTileId);if(!root||!t)return;
 const key=String(t.id),before=ui._h1InspectorOpen||{};const current={...before};
 for(const d of root.querySelectorAll('details[data-h1-group]'))current[d.dataset.h1Group]=d.open;
 ui._h1InspectorOpen=current;
 const v=t.ownerId==null?null:w.villages.find(n=>equal(n.id,t.ownerId));const s=t.settlementId==null?null:settlements(w).find(s=>equal(s.id,t.settlementId));
 const pop=v?.tileResidents?.(t.id)?.filter(p=>p.alive).length||0;
 const basic=document.createElement('section');basic.className='h1-tile-summary';
 basic.innerHTML=`<strong>🗺 타일 #${t.id} · (${t.x}, ${t.y}) ${esc(terrain(t))}</strong><div class="h1-tile-chips"><span>🏳️ ${esc(v?.name||'중립지')}</span><span>🏘 ${esc(s?.id||'정착지 없음')}</span><span>👥 ${pop}명</span><span>🏗 ${(t.buildings||[]).length}개 시설</span></div>${s?`<div class="small muted">정착지 전체 ${s.tileIds.length}타일 · 중심 #${s.coreTileId}</div>`:''}`;
 const old=[...root.childNodes];root.replaceChildren(basic);
 if(v){const nav=document.createElement('div');nav.className='h1-map-jump';nav.innerHTML='<button type="button" data-h1-go="settlement">🏘 정착지·타일 보기</button><button type="button" data-h1-go="nation">🏛 국가 개요</button>';
  nav.querySelector('[data-h1-go="settlement"]').onclick=()=>ui.goNation?.(t.ownerId,'settlements',t.id);nav.querySelector('[data-h1-go="nation"]').onclick=()=>ui.goNation?.(t.ownerId,'overview',t.id);root.appendChild(nav);}
 const defs=[['resources','🌿 자연자원·재고·경제'],['housing','🏗 주거·건설·정착지'],['military','⚔ 군사·전투'],['diagnostics','🔬 개발자 진단'],['more','📋 타일 상세 정보']];
 const buckets=Object.fromEntries(defs.map(x=>[x[0],[]]));
 for(const node of old){if(node.nodeType===3&&!node.textContent?.trim())continue;
  if(node.nodeType===1&&node.classList.contains('v034g1-tile-label'))continue;
  if(node.nodeType===1&&node.classList.contains('v16-jump'))continue;
  const cls=node.nodeType===1?String(node.className||'').toLowerCase():'';
  const label=cls+' '+(node.nodeType===1?String(node.textContent||'').slice(0,100):'');
  let group='more';
  if(/diagnos|audit|profiler|v34c-settlement-tile|pathcost|spatial-index|경로비용|성능|회계 검사/.test(label))group='diagnostics';
  else if(/military|formation|battle|combat|전투 기록|병력|전쟁/.test(label))group='military';
  else if(/housing|construction|v34d1-settlement|v034d2|건축공간|주거/.test(label))group='housing';
  else if(/v17-inspector-grid|econom|stock|resource|v17-price-row|v034d3|자연자원/.test(label))group='resources';
  buckets[group].push(node);
 }
 for(const [id,label] of defs){if(!buckets[id].length)continue;const details=document.createElement('details');details.dataset.h1Group=id;details.open=!!current[`${key}:${id}`];details.className='h1-inspector-detail';
  const summary=document.createElement('summary');summary.textContent=label;details.appendChild(summary);
  const content=document.createElement('div');content.className='h1-inspector-detail-body';content.append(...buckets[id]);details.appendChild(content);
  details.addEventListener('toggle',()=>{ui._h1InspectorOpen=ui._h1InspectorOpen||{};ui._h1InspectorOpen[`${key}:${id}`]=details.open;});root.appendChild(details);
 }
}
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}
 // The old H0 integrity notice can be stale during source installation; retain errors only.
 const report=NS.V034G5?.verify?.(window.villageObserver?.world),notice=document.getElementById('g3aRuntimeIntegrity');if(notice&&report){notice.hidden=!!report.ok;notice.style.display=report.ok?'none':'';if(!report.ok){notice.textContent='⚠ H1 무결성 검사 실패';notice.setAttribute('role','alert');}}
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const d=oldSerialize.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(data,...args){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREVIOUS}:data,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const j=oldJSON.apply(this,args);j.version=VERSION;return j;};
function download(name,obj){const url=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const json=localStorage.getItem(KEY);return json?NS.World.from(JSON.parse(json)):oldSave.load?.();},export(w){download(`village-observer-v034H1-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){download(`village-observer-v034H1-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
if(P){const map=P.renderMap,tile=P.renderTile,mapView=P.renderMapView,header=P.renderHeader,set=P.setWorld,bind=P.bind;
 P.renderMap=function(...a){const r=map.apply(this,a);drawBoundaries(this);return r;};
 P.renderTile=function(...a){const r=tile.apply(this,a);categorizeTile(this);return r;};
 if(typeof mapView==='function')P.renderMapView=function(...a){const r=mapView.apply(this,a);updateStats(this);return r;};
 P.renderHeader=function(...a){const r=header.apply(this,a);updateStats(this);installControls(this);refresh();return r;};
 P.setWorld=function(w,...a){const r=set.call(this,w,...a);invalidate(this.world);updateStats(this);return r;};
 P.bind=function(...a){const r=bind.apply(this,a);installControls(this);return r;};
}
NS.V034H1=Object.freeze({version:VERSION,geometry:boundaryGeometry,geometryFor,invalidate,drawBoundaries,settlements,refresh,compatibility:['V0.34H1','V0.34H0','V0.34G5'],verify:()=>NS.V034G5.verify(window.villageObserver?.world)});
if(typeof document!=='undefined'){const css=document.createElement('style');css.textContent=`
.v33g2a-map-card{padding:6px 9px!important;min-height:unset!important}.v33g2a-map-card .small{line-height:1.3}
.h1-boundary-setting{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text,#eaf1ff)}
.h1-boundary-setting select{min-height:35px;min-width:104px;border:1px solid var(--line,#4a5c6c);border-radius:7px;padding:5px 7px;background:#152840;color:#eaf1ff}
#view-map #globalStats{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px}
.h1-tile-summary{border:1px solid rgba(108,175,230,.42);border-radius:11px;background:rgba(80,132,185,.12);padding:11px;line-height:1.7}
.h1-tile-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.h1-tile-chips>span{font-size:12px;border:1px solid rgba(127,161,195,.3);background:rgba(20,40,58,.5);padding:2px 7px;border-radius:7px}
.h1-map-jump{display:flex;flex-wrap:wrap;gap:7px;margin:8px 0 12px}.h1-map-jump button{flex:1;min-width:150px}
.h1-inspector-detail{margin-top:8px;border:1px solid var(--line,#384a5d);border-radius:9px;background:rgba(37,62,86,.17);overflow:hidden}
.h1-inspector-detail>summary{cursor:pointer;padding:10px 12px;font-weight:650;font-size:13px}
.h1-inspector-detail-body{padding:6px 11px 12px;line-height:1.65;overflow-wrap:anywhere}
@media(max-width:650px){.h1-boundary-setting{width:100%;justify-content:space-between}.h1-boundary-setting select{flex:1}}
`;document.head.appendChild(css);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'지도 UI · 정착지 경계 V2',summary:'국가색으로 정착지 완전 외곽선을 그리고 내부 음영 및 선택 강조를 추가합니다. 구형 생활권 레이어를 제거하고 지도 상단 정착지 집계와 타일 상세 화면을 정리합니다.',sections:[['지도',['정착지 완전 외곽선·국가색·약한 내부 음영·선택 강조 모드','실제 Settlement 수·영토 타일 수·국고 합계 구분','구형 생활권 시각화만 제거; 신세계·맵 파일 가져오기 유지']],['타일 상세',['타일 고유 기본 정보, 정착지 소속, 인구·시설 수를 먼저 표시','자원/경제·주거/건설·군사/전투·개발자 진단 접기 구성']],['보존',['시뮬레이션·AI·전쟁·물리재고·Gold·기술 43개·F0/F1·CSV 1683열 보존','H0/G5 저장파일을 이어서 불러오기 지원']]]});
refresh();
try {const ui=window.villageObserver;if(ui){ui.renderHeader?.();if(ui.view==='map')ui.renderMapView?.();}}catch(e){console.warn('H1 initial UI refresh',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h2.js */
/* V0.34H2 — Nation UI Consolidation V1.
   View-model reads are pure. The legacy rendering chain is invoked first to
   preserve all currently installed engines/handlers, then grouped as expandable
   diagnostics. New interactions re-render only the H2 view (no AI callbacks).
 */
(function(NS){'use strict';
const VERSION='V0.34H2',PREV='V0.34H1',KEY='village-observer-v034h2';
const P=NS.UI?.prototype;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=x=>Number.isFinite(Number(x))?Number(x):0, f=(x,d=1)=>n(x).toFixed(d);
const equal=(a,b)=>String(a)===String(b);
const alive=v=>(v?.residents||[]).filter(p=>p.alive!==false);
const groups=(v,w)=>NS.V034G1A?.groupsForUI?.(v,w)||[];
const tilesFor=(w,g)=>(g?.tileIds||[]).map(x=>Number(x));
const top=(name,value,sub='')=>`<div class="h2-metric"><span>${esc(name)}</span><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`;
const metrics=(...items)=>`<div class="h2-metrics">${items.join('')}</div>`;
const detail=(title,body,id='',open=false)=>`<details class="h2-detail" ${id?`data-h2-detail="${esc(id)}"`:''}${open?' open':''}><summary>${title}</summary><div class="h2-detail-body">${body}</div></details>`;
const formatPlace=(w,id)=>{const t=w.map.get(Number(id));return t?`#${t.id} (${t.x},${t.y})`:'—';};
const ratio=(x,max)=>`<div class="h2-bar"><i style="width:${Math.min(100,Math.max(0,max?100*n(x)/n(max):0)).toFixed(1)}%"></i></div>`;
const resNames={food:'🌾 식량',wood:'🪵 목재',stone:'🪨 석재',iron_ore:'⛏ 철광석',iron:'🔩 철',tools:'🔧 도구'};
const sf=(v,w)=>groups(v,w).filter(g=>g?.tileIds?.length);
function cultureMix(ps,v){const out=new Map();let mixed=0;for(const p of ps){const raw=Array.isArray(p.cultureMix)?p.cultureMix:[],mix=raw.length?raw:[{id:NS.V033E4?.foundingCulture?.(v.id)||'TER',share:1}];let counted=0;for(const e of mix){const share=Math.max(0,n(e.share));out.set(e.id,(out.get(e.id)||0)+share);if(share>=.02)counted++;}if(counted>1)mixed++;}return{parts:[...out].map(([id,val])=>[id,ps.length?val/ps.length:0]).sort((a,b)=>b[1]-a[1]),mixed};}
function context(ui){const w=ui.world,v=w?.selectedNation;return{w,v,ps:alive(v),g:v?sf(v,w):[],key:`${v?.id||'none'}:${ui.sub}`};}
function overview({w,v,ps,g}){const sp=v.v33c2StrategicProgram,cal=n(w.calendarOrdinalDay?.()??n(w.ordinalDay?.())*3),days=sp?Math.max(0,n(sp.untilCal)-cal):0;
 const focus=({FOOD:'식량',HOUSING:'주거',TRADE:'교역',SECURITY:'방어',EXPAND:'확장',MAINTAIN:'유지'})[v.focus]||v.focus||'미지정',s=sp?`${esc(sp.label||sp.id)} · 남은 ${days.toFixed(0)}일`:'현재 기록된 중기 전략 없음';
 const scores=sp?.reviewScores?Object.entries(sp.reviewScores).sort((a,b)=>n(b[1])-n(a[1])).map(([k,x])=>`<span>${esc(k)} ${f(x)}</span>`).join(' · '):'검토 이력 없음';
 const strat=`<section class="h2-hero"><strong>🧭 현재 국가 전략</strong><div class="h2-big">${esc(focus)}</div><div>${s}</div>${detail('AI 전략의 상세 및 근거',`<p>중기 프로그램 ${s}</p><p>시작 ${f(sp?.startedCal,0)}일 · 마지막 평가 ${f(sp?.lastReviewCal,0)}일</p><p>평가 시점에 저장된 점수: ${scores}</p><p class="h2-muted">화면 조회 중 전략 재평가·난수 소비 없음. 비상 정책은 이 전략보다 우선할 수 있습니다.</p>`,'program')}</section>`;
 const wellbeing=ps.length?ps.reduce((a,p)=>a+n(p.happiness),0)/ps.length:null;
 const country=metrics(top('인구',ps.length+'명'),top('정착지',g.length+'개'),top('영토',v.territory.size+'타일'),top('국고',f(v.gold)+' G'),top('기술',`${v.technologies.size}/${NS.TECH_ORDER.length}`),top('평균 행복',wellbeing==null?'—':f(wellbeing,0)));
 const sizes=g.map(x=>n(x.population)).sort((a,b)=>a-b),sum=sizes.reduce((a,b)=>a+b,0),gini=sum&&sizes.length?sizes.reduce((a,x,i)=>a+(i*2-sizes.length+1)*x,0)/(sizes.length*sum):0;
 const top3=sum?sizes.slice(-3).reduce((a,b)=>a+b,0)/sum*100:0;
 return strat+country+metrics(top('식량 비축',f(v.foodReserveDays?.())+'일'),top('최저 비축',f(v.criticalFoodReserveDays?.())+'일'),top('주민 건강',ps.length?f(ps.reduce((a,p)=>a+n(p.health),0)/ps.length,0):'—'))+
 detail('도시화·집중도',`<p>정착지 인구 Gini ${f(gini,3)} · 상위 3개 정착지의 인구 집중도 ${f(top3)}%</p><p class="h2-muted">실제 Settlement 별 인구 기준. 구형 통근/생활권 개수는 표시하지 않습니다.</p>`,'urban')+
 detail('국정·외교·건설 상세',`<p>기존 정책·교역망·주거·개척 진단은 아래 기존 상세 정보에서 확인할 수 있습니다.</p>`,'governance');}
function residentView({w,v,ps,g},ui){const st=ui._h2State||{};const name=String(st.search||'').trim().toLowerCase(),job=st.job||'all',sid=st.sid||'all',sort=st.sort||'name',page=Math.max(0,n(st.page));const byTile=new Map();for(const s of g)for(const id of tilesFor(w,s))byTile.set(id,String(s.settlementId));
 const filtered=ps.filter(p=>(!name||String(p.name||'').toLowerCase().includes(name))&&(job==='all'||String(p.job||'')===job)&&(sid==='all'||byTile.get(Number(p.homeTileId))===sid));
 const cmp=(a,b)=>sort==='age'?n(b.age)-n(a.age):sort==='health'?n(b.health)-n(a.health):sort==='happiness'?n(b.happiness)-n(a.happiness):String(a.name||'').localeCompare(String(b.name||''),'ko');filtered.sort(cmp);
 const pages=Math.max(1,Math.ceil(filtered.length/20)),idx=Math.min(page,pages-1),jobs=[...new Set(ps.map(p=>String(p.job||'미배정')))].sort();
 const opts=(arr,selected)=>arr.map(([id,label])=>`<option value="${esc(id)}"${equal(id,selected)?' selected':''}>${esc(label)}</option>`).join('');
 const cutoff=n(w.ordinalDay?.())-120,dem={births:0,deaths:0},causes={};for(const e of w.telemetry?.entries||[]){if(n(e.ordinalDay)<cutoff||(!equal(e.payload?.villageId,v.id)&&e.payload?.village!==v.name))continue;if(e.type==='BIRTH')dem.births++;if(['DEATH_STARVATION','DEATH_ILLNESS','DEATH_OLD_AGE'].includes(e.type)){dem.deaths++;causes[e.type]=(causes[e.type]||0)+1;}}
 let html=metrics(top('총인구',ps.length+'명'),top('최근 1년 출생',dem.births+'명','보존된 Devlog 기준'),top('최근 1년 사망',dem.deaths+'명','기아·질병·노령 로그'),top('평균 연령',ps.length?f(ps.reduce((a,p)=>a+n(p.age),0)/ps.length):'—'),top('현재 목록',filtered.length+'명'));
 html+=`<div class="h2-filters"><label>이름 검색<input data-h2-field="search" type="search" value="${esc(st.search||'')}" placeholder="이름"></label><label>직업<select data-h2-field="job">${opts([['all','모든 직업'],...jobs.map(j=>[j,j])],job)}</select></label><label>정착지<select data-h2-field="sid">${opts([['all','전체 정착지'],...g.map(s=>[String(s.settlementId),String(s.settlementId)])],sid)}</select></label><label>정렬<select data-h2-field="sort">${opts([['name','이름'],['age','나이 내림차순'],['health','건강 내림차순'],['happiness','행복 내림차순']],sort)}</select></label></div>`;
 html+='<div class="h2-people">'+filtered.slice(idx*20,idx*20+20).map(p=>{const m=(Array.isArray(p.cultureMix)?p.cultureMix:[]).map(x=>`${x.id} ${(n(x.share)*100).toFixed(0)}%`).join(' · ');return detail(`<strong>${esc(p.name)}</strong> · ${n(p.age)}세 · ${esc(p.job)} · ❤️ ${f(p.health,0)} · 행복 ${f(p.happiness,0)} · ${esc(m||'문화 미집계')}`,`<div>출생 ${esc(p.birthOrdinal24??'미기록')} · 거주 ${esc(formatPlace(w,p.homeTileId))} · 근무 ${esc(formatPlace(w,p.workTileId))}</div><div>현재 행동 ${esc(p.currentAction||'없음')} · 문화 ${esc(m)}</div>`);}).join('')+'</div>';
 html+=`<div class="h2-pages"><button data-h2-page="${idx-1}" ${idx===0?'disabled':''}>이전</button><span>${idx+1} / ${pages} 페이지</span><button data-h2-page="${idx+1}" ${idx>=pages-1?'disabled':''}>다음</button></div>`;
 html+=detail('출생·사망 원인 상세',`<p>기아 ${n(causes.DEATH_STARVATION)}명 · 질병 ${n(causes.DEATH_ILLNESS)}명 · 노령 ${n(causes.DEATH_OLD_AGE)}명</p><p>전투·기타 사망은 이 요약에 포함하지 않습니다. 상세 이벤트는 Devlog에서 확인하세요.</p>`,'demography');return html;}
function socialView({w,v,g}){const ui=window.villageObserver,st=ui?._h2State||{},scope=st.socialScope||'nation';let people=[];if(scope==='world')people=(w.activeVillages||[]).flatMap(alive);else if(scope==='nation')people=alive(v);else{const group=g.find(x=>String(x.settlementId)===scope);const tileSet=new Set(tilesFor(w,group));people=alive(v).filter(p=>tileSet.has(Number(p.homeTileId)));}
 const opts=[['world','세계'],['nation','국가'],...g.map(s=>[String(s.settlementId),`정착지 ${s.settlementId}`])];const m=cultureMix(people,v);const avg=people.length?people.reduce((a,p)=>a+n(p.age),0)/people.length:0;const male=people.filter(p=>p.sex==='남').length;const jobs=new Map();const ages=new Map();for(const p of people){const job=p.job||'미배정';jobs.set(job,(jobs.get(job)||0)+1);const grp=Math.min(80,Math.floor(n(p.age)/10)*10);ages.set(grp,(ages.get(grp)||0)+1);}
 const c=m.parts.map(([name,r])=>`<div class="h2-field">${esc(name)} ${f(r*100)}% ${ratio(r,1)}</div>`).join('');
 const a=[...ages].sort((x,y)=>x[0]-y[0]).map(([age,count])=>`<div class="h2-field">${age}세~ ${count}명 ${ratio(count,people.length)}</div>`).join('');
 return `<label class="h2-scope">관찰 범위 <select data-h2-field="socialScope">${opts.map(([id,label])=>`<option value="${esc(id)}"${scope===id?' selected':''}>${esc(label)}</option>`).join('')}</select></label>`+metrics(top('인구',people.length+'명'),top('평균 연령',f(avg)+'세'),top('남성',male+'명'),top('여성',(people.length-male)+'명'),top('혼합문화',m.mixed+'명'))+`<h3>문화 구성</h3>${c||'<p>주민 없음</p>'}<h3>연령 분포</h3>${a||'<p>주민 없음</p>'}`+detail('직업 분포',[...jobs].sort((a,b)=>b[1]-a[1]).map(([job,count])=>`<div class="h2-field">${esc(job)} ${count}명 ${ratio(count,people.length)}</div>`).join('')||'주민 없음','jobs')+detail('수도 문화 정렬·생산 마찰','<p>문화 정렬 및 생산 마찰은 현재 국가 기준 상세 진단을 참조합니다. 세계 범위와 정착지 범위에는 국가 수도 정렬치를 임의로 합산하지 않습니다.</p>','culture');}
function economy({w,v,g,ps}){const wallet=ps.reduce((a,p)=>a+n(p.gold29),0),market=[...v.territory].reduce((a,id)=>a+n(w.map.get(id)?.v29Economy?.marketGold),0);const keys=Object.keys(resNames),rs=keys.map(k=>top(resNames[k],f(v.resourceTotal?.(k)??v[k]??0,0))).join('');
 const settlements=g.map(s=>{const center=s.coreTileId,stock=n(v.stockAt?.(center,'food')),reserve=n(v.settlementReserveDays?.(center));return `<div class="h2-row">정착지 ${esc(s.settlementId)} · 주민 ${n(s.population)}명 · 식량 ${f(stock,0)} · 비축 ${f(reserve)}일</div>`;}).join('');
 return `<h3>재정 현황</h3>`+metrics(top('국고',f(v.gold)+' G'),top('시장 Gold',f(market)+' G'),top('주민 지갑',f(wallet)+' G'))+`<h3>실물 재고</h3><div class="h2-metrics">${rs}</div>`+detail('정착지별 경제',settlements||'정착지 없음','settle')+detail('생산·소비·재고 순변화',`<p>생산량과 소비량은 동일한 기간·단위를 갖는 검증된 계측만 표시해야 합니다. 현재 H2에서는 임의의 순생산 계산을 하지 않고 기존 상세 계측을 유지합니다.</p>`,'flows')+detail('국내 물류·지역 시장',`내부 운송 ${n(v.logisticsStats?.moves)}회 · 누적 이동량은 기존 상세 계측 참조`,'logistics');}
function trade({w,v}){const st=window.villageObserver?._h2State||{},partner=st.partner||'all',resource=st.resource||'all',direction=st.direction||'all',period=st.period||'365',idx=Math.max(0,n(st.tradePage));const nations=(w.villages||[]).filter(x=>x.id!==v.id),routes=nations.map(x=>{const k=[v.id,x.id].map(Number).sort((a,b)=>a-b).join('-'),row=w.tradeRouteCache?.[k],r=row?.info?{...row.info,range:row.info.range}:null;return{nation:x,info:r};});const now=n(w.ordinalDay?.()),all=[...(v.tradeHistory||[])].reverse(),filtered=all.filter(x=>(partner==='all'||equal(x.buyerId,partner)||equal(x.sellerId,partner))&&(resource==='all'||x.resource===resource)&&(direction==='all'||(direction==='import'?equal(x.buyerId,v.id):equal(x.sellerId,v.id)))&&(period==='all'||!Number.isFinite(Number(x.day))||now-n(x.day)<=n(period)));
 const pages=Math.max(1,Math.ceil(filtered.length/15)),page=Math.min(idx,pages-1);const options=(items,value)=>items.map(([k,label])=>`<option value="${esc(k)}"${value===k?' selected':''}>${esc(label)}</option>`).join('');
 const card=routes.map(({nation:r,info})=>`<div class="h2-row"><b>${esc(r.name)}</b> · ${info?(info.reachable?'연결 가능':'경로 미연결'):'접속 정보 미계측'} · 경로비용 ${info&&Number.isFinite(info.cost)?f(info.cost):'—'} / 범위 ${info?f(info.range):'—'}</div>`).join('');
 const records=filtered.slice(page*15,page*15+15).map(x=>`<div class="h2-row">${esc(x.time||x.day)} · ${esc(x.seller)} → ${esc(x.buyer)} · ${esc(resNames[x.resource]||x.resource)} ${f(x.qty)}<div class="h2-muted">상품 ${f(x.price)} G · 운송 ${f(x.fee)} G · 경로 ${f(x.routeCost)}</div></div>`).join('')||'<p>조건에 맞는 거래 기록 없음</p>';
 return metrics(top('경로 연결 국가',routes.filter(x=>x.info?.reachable).length+'/'+nations.length),top('누적 거래',n(v.tradeStats?.count)+'회'),top('누적 판매 Gold',f(v.tradeStats?.goldEarned)+' G'))+`<h3>상대국별 접근성</h3>${card}<h3>거래 기록</h3><div class="h2-filters"><label>상대국<select data-h2-field="partner">${options([['all','전체'],...nations.map(x=>[String(x.id),x.name])],partner)}</select></label><label>자원<select data-h2-field="resource">${options([['all','전체'],...Object.entries(resNames)],resource)}</select></label><label>방향<select data-h2-field="direction">${options([['all','전체'],['import','수입'],['export','수출']],direction)}</select></label><label>기간<select data-h2-field="period">${options([['365','최근 1년'],['1800','최근 5년'],['all','전체']],period)}</select></label></div>${records}<div class="h2-pages"><button data-h2-tradepage="${page-1}" ${page===0?'disabled':''}>이전</button><span>${page+1}/${pages} 페이지</span><button data-h2-tradepage="${page+1}" ${page===pages-1?'disabled':''}>다음</button></div>`+detail('호가·거래 제약·정보 신선도','<p>국제 호가·AI가 알고 있는 외국 시장 정보 및 운송 조건은 아래 기존 교역 상세에서 확인할 수 있습니다. 연결 가능하더라도 거래 성립은 별개입니다.</p>','quotes')+detail('교역 전략·인프라','<p>도로·교역소·시장 건설 계획의 기존 상세를 보존합니다.</p>','infra');}
function military({w,v,ps}){
 const fs=v.v32dMilitary?.formations||v.military32A?.formations||[],coh=v.military32A?.cohorts||[];
 const members=f=>[...new Set((f.cohortIds||[]).flatMap(id=>coh.find(c=>equal(c.id,id))?.memberIds||[]).map(String))];
 const active=fs.filter(f=>f.v33d1Lifecycle!=='DORMANT'&&f.v33d1HasPhysicalPresence!==false),men=active.reduce((sum,x)=>sum+members(x).length,0);
 const actualMilitary=ps.filter(p=>p.militaryStatus32A==='active').length;
 const activeWars=NS.V033D?.warsForNation?.(w,v.id)||NS.V033?.warForNation?.(w,v.id)||[];const wars=Array.isArray(activeWars)?activeWars:(activeWars?[activeWars]:[]);
 const cards=fs.map((x,i)=>{const ids=members(x),size=ids.length,position=x.v33d1HasPhysicalPresence===false?'물리 위치 없음':formatPlace(w,x.tileId??x.currentTileId),power=typeof NS.V033I2?.formationPower==='function'?NS.V033I2.formationPower(v,x):(x.v33h2CombatPower??x.combatPower??x.power??null);
  return detail(`⚔ ${esc(x.name||`Formation ${i+1}`)} · ${size}명 · ${esc(x.status||'대기')}${x.commanderId?' ⭐':''}`,`<div>위치 ${esc(position)} · 목표 ${esc(formatPlace(w,x.targetTileId))} · 임무 ${esc(x.v33dMission||'대기')}</div><div>전투력 ${power==null?'기존 전투력 상세 확인':f(power)} · 지휘관 ${esc(x.commanderId??'미지정')}</div><div>보급 ${f(x.supply,0)} · 훈련 ${f(x.training,0)} · 사기 ${f(x.morale,0)} · 장비 상세는 기존 군사 정보 참조</div>`);}).join('');
 return metrics(top('현역 Person',actualMilitary+'명'),top('야전 Formation 병력',men+'명'),top('활성 Formation',active.length+'/'+fs.length),top('관련 전쟁',wars.length+'개'))+`<h3>Formation 목록</h3>${cards||'<p>편성된 Formation 없음</p>'}`+detail('전쟁 준비·정보 정찰','<p>적국 병력 추정치와 관찰자의 완전정보를 구분합니다. 기존 E2 정보·정찰 및 D2 준비 상세를 보존합니다.</p>','intel')+detail('군수·장비','<p>개인별 장비, 지역 군수 재고, 작업 명령 및 보존식 검사 항목은 아래 기존 군사 상세에서 확인할 수 있습니다.</p>','equip')+detail('최근 전쟁','<p>현재 전쟁 요약과 히스토리는 기존 군사·통계 상세에서 확인합니다.</p>','history');}

function technology({w,v}){const cur=NS.TECH?.[v.researchTarget],done=v.technologies||new Set(),branch=new Map();for(const id of NS.TECH_ORDER){const t=NS.TECH[id]||{},b=t.branch||'기타';if(!branch.has(b))branch.set(b,[0,0]);branch.get(b)[1]++;if(done.has(id))branch.get(b)[0]++;}
 const recent=(w.telemetry?.entries||[]).filter(e=>e.type==='TECH_COMPLETED'&&(equal(e.payload?.villageId,v.id)||e.payload?.village===v.name)).slice(-5).reverse();
 return metrics(top('보유 기술',`${done.size}/${NS.TECH_ORDER.length}`),top('현재 연구',cur?.label||'없음'),top('누적 Knowledge',v.totalKnowledge!=null?f(v.totalKnowledge,0)+' K':'미집계'))+`<h3>현재 연구</h3>${cur?`${esc(cur.icon||'')} ${esc(cur.label)} · ${f(v.researchProgress,0)}/${f(cur.cost,0)} K ${ratio(v.researchProgress,cur.cost)}`:'<p>연구 목표 없음</p>'}<h3>분야별 기술 현황</h3>${[...branch].map(([b,[count,total]])=>`<div class="h2-field">${esc(b)} · ${count}/${total} ${ratio(count,total)}</div>`).join('')}`+detail('최근 연구 완료',recent.map(e=>`<div class="h2-row">${esc(e.payload?.tech||NS.TECH[e.payload?.techId]?.label||e.payload?.techId||'기술')} · ${esc(e.simTime||e.ordinalDay)}</div>`).join('')||'<p>보존된 로그에 완료 기록 없음</p>','recent')+detail('보유 기술 목록',[...done].map(k=>`<span class="h2-tech">${esc(NS.TECH[k]?.icon||'')} ${esc(NS.TECH[k]?.label||k)}</span>`).join('')||'없음','owned')+`<p class="h2-muted">기술 선행 조건·유레카·효과 및 전체 트리는 독립 기술 탭과 기존 연구 상세에서 확인합니다.</p>`;}
const views={overview,residents:residentView,economy,trade,social:socialView,military,tech:technology};
function renderH2(ui,initial=false){if(!views[ui.sub])return;const c=context(ui),root=ui.q?.('villageContent');if(!c.v||!root)return;
 if(ui._h2Key!==c.key){ui._h2Key=c.key;ui._h2State={};ui._h2Expanded={};}
 let shell=root.querySelector(':scope > .h2-root'),legacy=root.querySelector(':scope > .h2-original');
 if(!shell){const preservedBoard=ui.sub==='trade'?root.querySelector(':scope > .v32d5-board'):null;const old=[...root.childNodes].filter(node=>node!==preservedBoard),ret=document.createElement('details');ret.className='h2-original';const label=document.createElement('summary');label.textContent='🔬 기존 상세·계측 보기 (구버전 정보 포함)';ret.append(label);const contents=document.createElement('div');contents.className='h2-original-body';contents.append(...old);ret.append(contents);root.append(ret);legacy=ret;shell=document.createElement('div');shell.className='h2-root';root.insertBefore(shell,ret);if(preservedBoard){preservedBoard.hidden=true;ret.addEventListener('toggle',()=>{preservedBoard.hidden=!ret.open;});}}
 const previous={...ui._h2Expanded};for(const d of shell.querySelectorAll('details[data-h2-detail]'))previous[d.dataset.h2Detail]=d.open;ui._h2Expanded=previous;
 shell.innerHTML=`<div class="h2-header"><h2>${esc(c.v.name)} · ${esc(({overview:'개요',residents:'주민',economy:'경제',trade:'교역',social:'사회',military:'군사',tech:'기술'})[ui.sub])}</h2><span>H2</span></div>`+views[ui.sub](c,ui);
 for(const d of shell.querySelectorAll('details[data-h2-detail]')){d.open=!!previous[d.dataset.h2Detail];d.addEventListener('toggle',()=>{ui._h2Expanded[d.dataset.h2Detail]=d.open;});}
 const rerender=()=>renderH2(ui);
 shell.querySelectorAll('[data-h2-field]').forEach(el=>{el.addEventListener(el.type==='search'?'input':'change',()=>{const k=el.dataset.h2Field;ui._h2State[k]=el.value;ui._h2State.page=0;ui._h2State.tradePage=0;rerender();const field=shell.querySelector(`[data-h2-field="${k}"]`);if(el.type==='search'&&field){field.focus();field.setSelectionRange?.(field.value.length,field.value.length);}});});
 shell.querySelectorAll('[data-h2-page],[data-h2-tradepage]').forEach(b=>b.addEventListener('click',()=>{const key=b.hasAttribute('data-h2-page')?'page':'tradePage';ui._h2State[key]=Math.max(0,n(b.getAttribute(key==='page'?'data-h2-page':'data-h2-tradepage')));rerender();}));
}
const oldSer=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const out=oldSer.apply(this,a);out.version=VERSION;return out;};
NS.World.from=function(data,...a){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const out=oldJSON.apply(this,a);out.version=VERSION;return out;};
function download(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...oldSave,save(w){localStorage.setItem(KEY,JSON.stringify(w.serialize()));},load(){const json=localStorage.getItem(KEY);return json?NS.World.from(JSON.parse(json)):oldSave.load?.();},export(w){download(`village-observer-v034H2-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){download(`village-observer-v034H2-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
function refreshVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.setAttribute('data-runtime-version',VERSION);}}
if(P){const prior=P.renderVillageContent;P.renderVillageContent=function(...a){const res=prior.apply(this,a);renderH2(this,true);return res;};const priorHeader=P.renderHeader;P.renderHeader=function(...a){const result=priorHeader.apply(this,a);refreshVersion();return result;};}
NS.V034H2=Object.freeze({version:VERSION,readOnly:true,context,render:renderH2,views:Object.keys(views),verify:()=>NS.V034G5.verify(window.villageObserver?.world)});
if(typeof document!=='undefined'){const css=document.createElement('style');css.textContent=`
.h2-root{display:grid;gap:12px;margin:0 0 14px}.h2-header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line,#3b526a);padding-bottom:9px}.h2-header h2{margin:0}.h2-header span{font-size:11px;color:var(--muted,#8cacc7)}
.h2-hero{padding:13px 15px;border:1px solid #5c90b7;border-left:4px solid #78b8e2;background:rgba(73,119,166,.13);border-radius:11px;display:grid;gap:7px}.h2-big{font-size:18px;font-weight:750}
.h2-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(122px,1fr));gap:8px}.h2-metric{padding:10px;background:rgba(92,120,153,.12);border:1px solid var(--line,#42566d);border-radius:9px;display:grid;gap:4px}.h2-metric>span{font-size:12px;color:var(--muted,#adc5d9)}.h2-metric strong{font-size:18px}.h2-metric small{font-size:11px}
.h2-detail,.h2-original{border:1px solid var(--line,#405064);border-radius:9px;margin:5px 0;overflow:hidden}.h2-detail summary,.h2-original summary{padding:11px 13px;cursor:pointer;font-weight:650;background:rgba(87,125,168,.12)}.h2-detail-body,.h2-original-body{padding:11px 13px;overflow-wrap:anywhere}.h2-original{margin-top:18px}.h2-original-body>*{max-width:100%}
.h2-filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.h2-filters label,.h2-scope{display:grid;gap:4px;font-size:12px}.h2-filters input,.h2-filters select,.h2-scope select{min-height:34px;width:100%;border:1px solid var(--line,#456079);border-radius:7px;background:#14273b;color:#eef6ff;padding:6px}
.h2-people{display:grid;gap:3px}.h2-pages{display:flex;align-items:center;justify-content:center;gap:15px;padding:8px}.h2-row{border-bottom:1px solid var(--line,#385069);padding:8px 3px}.h2-muted{color:var(--muted,#b0bfc9);font-size:12px}.h2-field{margin:6px 0;font-size:13px}.h2-bar{height:7px;border-radius:8px;background:rgba(110,141,171,.2);overflow:hidden;margin:5px 0}.h2-bar i{display:block;background:#7eb7da;height:100%;border-radius:inherit}.h2-tech{display:inline-block;padding:4px 6px;border:1px solid var(--line,#405b76);border-radius:6px;margin:3px;font-size:12px}
@media(max-width:600px){.h2-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.h2-metric strong{font-size:16px}.h2-filters{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;document.head.appendChild(css);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-18',title:'국가 7개 탭 UI 통합 V1',summary:'AI 현재 전략 최상단, 주민 검색·페이지, 경제·교역·사회·Formation·연구 현황을 국가 탭별로 재구성하고 기존 상세 진단을 접기식으로 보존.',sections:[['국가 개요',['저장된 중기 전략과 현재 focus를 최상단 읽기 전용으로 표시','실제 Settlement 인구 집중도·Gini, 오래된 생활권/통근 지표를 주 화면에서 제거']],['주민·사회',['실제 주민 검색·직업/Settlement 필터·정렬·20명 단위 페이지','문화 비율·연령·직업의 세계/국가/Settlement 기준 분리']],['경제·교역',['국고·시장 Gold·개인 지갑 분리 및 실물 재고','교역 국가·자원·기간·수입수출 필터 및 페이지']],['군사·기술',['Formation 목록과 부대별 접기 상세, 기존 정찰·군수·전쟁 자료 보존','현행 43기술·분야별 진척·연구 목표']],['보존',['기존 국가별 전문 진단 패널은 기존 상세에 접어 보존','경제/AI/전투·Person/RNG·F0/F1·1683열 CSV 로직 미변경']]]});
try{refreshVersion();const ui=window.villageObserver;if(ui?.view==='village')ui.renderVillageContent();}catch(e){console.warn('H2 initial nation render',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h2a.js */
/* V0.34H2A — Settlement core abandonment & legacy ghost-link hotfix.
 * No Person, AI, RNG, combat, market, resource, construction or research
 * balancing changes. Event-free read-only validation when worlds are sound.
 */
(function(NS){'use strict';
const VERSION='V0.34H2A',PREV='V0.34H2',KEY='village-observer-v034h2a';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
const owned=x=>x!==null&&x!==undefined;
const same=(a,b)=>String(a)===String(b);
function targetedRepair(source){
 const tiles=source?.map?.tiles,records=source?.v34b?.settlements;
 if(!Array.isArray(tiles)||!Array.isArray(records)||source.v34b.schemaVersion!==2)return{data:source,repairs:[]};
 // IMPORTANT: H1/H2 saved-world import runs through V034B strict registry
 // validation before bootstrap post-load hooks. Repair serialized orphan links
 // here only when the original owner was already null and the linked ACTIVE
 // record itself lists the same tile. Never change a physical stock or owner.
 const byId=new Map(records.filter(r=>r?.lifecycle==='ACTIVE').map(r=>[String(r.id),r]));
 const candidates=[];
 for(const t of tiles){if(owned(t.ownerId)||!owned(t.settlementId))continue;
  const r=byId.get(String(t.settlementId));
  if(r?.tileIds?.some(id=>Number(id)===Number(t.id)))candidates.push([Number(t.id),String(r.id)]);
 }
 if(!candidates.length)return{data:source,repairs:[]};
 const data={...source,map:{...source.map,tiles:tiles.slice()},v34b:{...source.v34b,settlements:records.slice()}},idx=new Map(),repaired=[];
 const tileById=new Map(tiles.map(t=>[Number(t.id),t]));
 for(const [id,sid] of candidates){
  const j=records.findIndex(r=>String(r.id)===sid);if(j<0)continue;
  if(!idx.has(j)){data.v34b.settlements[j]={...records[j],tileIds:[...records[j].tileIds]};idx.set(j,true);}
  const r=data.v34b.settlements[j],tIndex=tiles.findIndex(t=>Number(t.id)===id);if(tIndex<0)continue;
  const t=tiles[tIndex];if(owned(t.ownerId)||!same(t.settlementId,sid))continue;
  data.map.tiles[tIndex]={...t,settlementId:null};
  r.tileIds=r.tileIds.filter(x=>Number(x)!==id);
  if(!r.tileIds.length){r.lifecycle='ABANDONED';r.abandonedCalendarDay=Number(source?.calendarOrdinalDay24??source?.day??0);}
  else if(!r.tileIds.includes(Number(r.coreTileId))){r.coreTileId=Math.min(...r.tileIds);}
  repaired.push({tileId:id,settlementId:sid,action:r.tileIds.length?'DETACH_AND_REBASE':'DETACH_AND_RETIRE'});
 }
 return{data,repairs:repaired};
}
NS.World.prototype.serialize=function(...args){const data=oldSerialize.apply(this,args);data.version=VERSION;data.v034h2a={revision:'settlement-core-abandonment-hotfix',savedLegacyGhostRepairs:this._h2aRepairedGhosts||[]};return data;};
NS.World.from=function(data,...args){const candidate=String(data?.version||'');const incoming=candidate===VERSION?{...data,version:PREV}:data;
 const {data:prepared,repairs}=targetedRepair(incoming),w=oldFrom.call(this,prepared,...args);
 const existing=Array.isArray(data?.v034h2a?.savedLegacyGhostRepairs)?data.v034h2a.savedLegacyGhostRepairs:[];
 if(repairs.length||existing.length){Object.defineProperty(w,'_h2aRepairedGhosts',{configurable:true,enumerable:false,writable:true,value:[...existing,...repairs]});}
 return w;
};
NS.Telemetry.prototype.toJSON=function(...args){const result=oldJSON.apply(this,args);result.version=VERSION;
 result.worldSummary.v034h2aRevision='settlement-core-abandonment-hotfix';
 result.worldSummary.v034h2aLegacyGhostRepairs=args[0]?._h2aRepairedGhosts?.length||0;
 return result;
};
const dl=(name,text,mime='application/json')=>{const url=URL.createObjectURL(new Blob([text],{type:mime})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},
 load(){const raw=localStorage.getItem(KEY);return raw?NS.World.from(JSON.parse(raw)):oldSave.load?.();},
 export(w){dl(`village-observer-v034H2A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v034H2A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));}
};
NS.RELEASE_VERSION=VERSION;
const refresh=()=>{const b=document.getElementById('versionBadge');if(b){b.innerHTML='Village Observer · <strong>'+VERSION+'</strong>';b.setAttribute('data-runtime-version',VERSION);}document.title='Village Observer '+VERSION;};
/* H1B2: redundant version-only UI wrapper omitted */
NS.V034H2A=Object.freeze({version:VERSION,repairImport:targetedRepair,verify:()=>NS.V034G5.verify(window.villageObserver?.world)});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-19',title:'정착지 중심타일 포기/재연결 핫픽스',summary:'정착지 핵심 타일 포기 뒤 이전 중심점이 다시 중립지에 연결되는 문제를 수정합니다. 기존 H2 세이브의 특정 고아 연결은 물리 재고·Gold 변경 없이 불러올 때 복구합니다.',sections:[['정착지 등록부',['타일 소유권 해제 때 생존 정착지의 중심점을 즉시 재선정합니다.','이후 분기 분할 검사에서 포기된 옛 중심지가 재생성되지 않도록 합니다.']],['세이브 복구',['H2 저장파일 중 중립 타일에 ACTIVE Settlement 링크가 남은 명백한 고아 연결만 검사 후 제거합니다.','원래 타일 소유권과 물리 재고·국고·시장·주민은 변경하지 않습니다.']],['범위',['G5 43개 기술과 H1 지도·H2 국가 UI를 그대로 유지합니다.','별도 석재 저장 용량 경고 및 AI·밸런스는 수정하지 않습니다.']]]});
try{refresh();}catch(e){console.warn('H2A status',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h3.js */
/* V0.34H3 — World & Statistics UI Consolidation V1.
 * UI/observer-only; consumes existing saved World and cached telemetry.
 * Never calls AI, production, combat, RNG or a snapshot function in render.
 */
(function(NS){'use strict';
const VERSION='V0.34H3',PREV='V0.34H2A',KEY='village-observer-v034h3';
const P=NS.UI?.prototype;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const d=id=>document.getElementById(id);
const fmt=(x,k=0)=>n(x).toLocaleString('ko-KR',{maximumFractionDigits:k});
const boolOwned=t=>t?.ownerId!==null&&t?.ownerId!==undefined;
const cap=(title,subtitle)=>`<div class="section-head"><div><h2>${title}</h2><div class="small muted">${subtitle}</div></div></div>`;
const metric=(title,value)=>`<div class="h3-metric"><span>${esc(title)}</span><strong>${esc(value)}</strong></div>`;
const exists=(t,w)=>t&&w?.map?.get?.(Number(t));

function createPanel(id,title,subtitle){const p=document.createElement('section');p.id=id;p.className='panel h3-panel';p.innerHTML=cap(title,subtitle);return p;}
function detailGroup(id,title,subtitle,open=false){const x=document.createElement('details');x.className='h3-group';x.id=id;x.open=open;const s=document.createElement('summary');s.innerHTML=`${title}<span>${subtitle}</span>`;x.append(s);return x;}
function ensureWorldShell(ui){const root=d('view-world');if(!root)return null;
 let shell=d('h3WorldRoot');if(shell)return shell;
 shell=document.createElement('div');shell.id='h3WorldRoot';shell.className='h3-world-root';root.prepend(shell);
 const overview=createPanel('h3Overview','🌐 세계 현황','세계에 실제 존재하는 주민·영토·정착지 집계');
 overview.insertAdjacentHTML('beforeend','<div id="h3WorldMetrics" class="h3-metrics"></div>');shell.append(overview);
 const compare=createPanel('h3Comparison','🏛 국가 비교','실제 국가·정착지·기술·국고·시장·주민 Gold 분리');
 compare.insertAdjacentHTML('beforeend',`<div class="h3-tools"><label>정렬 <select id="h3CompareSort"><option value="population">인구순</option><option value="territory">영토순</option><option value="tech">기술순</option><option value="money">총 통화량순</option></select></label><label><input id="h3CompareExtinct" type="checkbox"> 멸망 국가 포함</label></div><div id="h3CompareTable" class="h3-table-wrap"></div>`);shell.append(compare);
 d('h3CompareSort').addEventListener('change',()=>refreshWorld(ui,true));d('h3CompareExtinct').addEventListener('change',()=>refreshWorld(ui,true));
 const history=createPanel('h3Chronicle','📜 세계 연대기','보존된 세계 사건 기록 · 시간순 최근 80건');
 history.insertAdjacentHTML('beforeend',`<div class="h3-tools"><label>사건 <select id="h3ChronicleFilter"><option value="all">전체</option><option value="war">전쟁·점령</option><option value="death">멸망·사망</option><option value="tech">기술</option><option value="settlement">정착지·개척</option><option value="economy">교역·경제</option></select></label><span id="h3ChronicleCount" class="small muted"></span></div><div id="h3ChronicleList" class="h3-chronicle"></div>`);shell.append(history);
 d('h3ChronicleFilter').addEventListener('change',()=>refreshChronicle(ui,true));
 const observer=detailGroup('h3Observer','📊 성능·생존 관측','F0/F1 수집 방식 유지 · 세부 패널 기본 접힘');shell.append(observer);
 const storage=detailGroup('h3Storage','💾 저장 · Devlog · Snapshot','기존 파일 버튼·메모 유지',false);shell.append(storage);
 const advanced=detailGroup('h3Advanced','🔧 관찰자 개입·AI·개발자 도구','시뮬레이션 변경 기능 · 기본 접힘',false);shell.append(advanced);
 const diagnostics=detailGroup('h3Diagnostics','🧪 기존 상세 진단','과거 버전 패널 기능 보존',false);advanced.append(diagnostics);
 const audit=document.createElement('div');audit.id='h3AuditCheck';audit.className='panel';
 audit.innerHTML='<h3>정착지·자원 무결성 수동 검사</h3><div class="small muted">필요할 때만 실제 감사 실행 · 렌더링/타이머에서는 실행하지 않습니다.</div><button id="h3AuditRun">현재 세계 감사 실행</button><div id="h3AuditOutput" class="small muted" aria-live="polite">아직 검사하지 않았습니다.</div>';
 diagnostics.append(audit);
 d('h3AuditRun').onclick=()=>runAudit(ui);
 // Transfer legacy DOM rather than clone: all event handlers and object identities survive.
 for(const el of Array.from(root.children)){
  if(el===shell)continue;
  if(el.id==='v034f0PerfPanel'||el.id==='v034f1Panel'||el.id==='v30aPerfPanel'){observer.append(el);continue;}
  if(el.matches('.panel')){
   const title=el.querySelector('h2')?.textContent?.trim()||'';
   if(title.startsWith('세계 연대기')){const old=d('chronicle');if(old){old.setAttribute('aria-hidden','true');old.hidden=true;el.hidden=true;}diagnostics.append(el);}
   else if(title.startsWith('개발 로그')||title==='세이브')storage.append(el);
   else if(title.startsWith('관찰자 개입')||el.id==='aiProfilePanel33G1'||el.id==='g3ValidationPanel')advanced.insertBefore(el,diagnostics);
   else diagnostics.append(el);
  }else diagnostics.append(el);
 }
 return shell;
}
function moveObservationPanels(){const target=d('h3Observer'),advanced=d('h3Diagnostics'),root=d('view-world'),shell=d('h3WorldRoot');if(!target||!root||!shell)return;
 for(const id of ['v034f0PerfPanel','v034f1Panel','v30aPerfPanel']){const el=d(id);if(el&&el.parentElement!==target)target.append(el);}
 // Old E-series UI can lazily insert a panel relative to first .panel descendant
 // after H3 has already grouped the world view. Re-home without cloning it.
 for(const child of [...shell.children,...root.children]){
  if(child===shell||child.id?.startsWith('h3'))continue;
  if(child.nodeType!==1)continue;
  const parent=(child.id==='v034eE01Panel'||child.id==='v30aPerfPanel')? (child.id==='v30aPerfPanel'?target:advanced):advanced;
  if(parent&&child.parentElement!==parent)parent.append(child);
 }
 // Earlier releases emitted literal backslash-n text between script tags. Remove
 // only those non-semantic body text nodes, not actual UI elements or controls.
 if(!document.body.dataset.h3TextCleaned){for(const textNode of [...document.body.childNodes])if(textNode.nodeType===3&&/^(?:\s|\\n)+$/.test(textNode.textContent||'')&&textNode.textContent?.includes('\\n'))textNode.remove();document.body.dataset.h3TextCleaned='1';}
}
function runAudit(ui){const w=ui.world,out=d('h3AuditOutput');if(!out||!w)return;
 try{const c=NS.V034C.inspect(w),d2=NS.V034D2.audit(w),d3=NS.V034D3.audit(w);
  const errors=[...(c.errors||[]).map(e=>'C: '+String(e.code||e)),...(d2.errors||[]).map(e=>'D2: '+String(e)),...(d3.errors||[]).map(e=>'D3: '+String(e))],warnings=[...(d3.warnings||[])];
  ui._h3LastAudit={world:w,errors,warnings,when:w.timestamp?.()||''};
  out.innerHTML=`<div>검사 시점 ${esc(ui._h3LastAudit.when)} · <strong>${errors.length?'오류 '+errors.length+'건':'무결성 오류 0건'}</strong> · 주의 ${warnings.length}건</div>${errors.slice(0,12).map(e=>`<div class="h3-audit-err">${esc(e)}</div>`).join('')}${warnings.slice(0,12).map(e=>`<div class="h3-audit-warn">${esc(e)}</div>`).join('')}${warnings.length>12?`<div>그 외 ${warnings.length-12}건</div>`:''}`;
  refreshIntegrity(ui);
 }catch(e){out.textContent='수동 감사 실행 실패: '+String(e?.message||e);}
}
function refreshChronicle(ui,force=false){if(ui.view!=='world'||!d('h3ChronicleList'))return;
 const w=ui.world,events=w?.events||[],filter=d('h3ChronicleFilter')?.value||'all';
 const last=events[events.length-1],sig=`${events.length}:${last?.time}:${last?.text}:${filter}`;
 if(!force&&ui._h3ChronicleSig===sig)return;ui._h3ChronicleSig=sig;
 const matches=e=>{if(filter==='all')return true;const str=`${e?.type||''} ${e?.text||''}`;
  return (filter==='war'&&/전쟁|점령|평화|선전|WAR|BATTLE|OCCUP/i.test(str))||(filter==='death'&&/멸망|사망|사망자|기아|DEATH|EXTINCT/i.test(str))||(filter==='tech'&&/기술|연구|TECH/i.test(str))||(filter==='settlement'&&/정착|개척|거점|건설|SETTLEMENT|FRONTIER/i.test(str))||(filter==='economy'&&/경제|교역|Gold|시장|TRADE|GOLD/i.test(str));};
 const rows=events.filter(matches),slice=rows.slice(-80).reverse();
 d('h3ChronicleCount').textContent=`보존 기록 중 ${rows.length}건 · 최근 ${slice.length}건 표시`;
 d('h3ChronicleList').innerHTML=slice.map(e=>`<div class="h3-history-item"><span>${esc(e.time||'')}</span>${esc(e.text||e.type||'')}</div>`).join('')||'<p class="small muted">해당 유형으로 보존된 사건이 없습니다. 자세한 장기 기록은 Devlog JSON을 확인하세요.</p>';
}
function refreshWorld(ui,force=false){if(ui.view!=='world'||!ui.world||!d('h3WorldRoot'))return;
 const w=ui.world,stamp=`${w.year}:${w.quarter}:${w.day}:${w.activeVillages?.length}:${w.telemetry?.snapshots?.length}`;
 if(!force&&ui._h3WorldStamp===stamp){refreshChronicle(ui);return;}ui._h3WorldStamp=stamp;
 const active=w.activeVillages||[],territory=w.map?.tiles?.filter(boolOwned).length||0;
 const groups=active.reduce((a,v)=>a+(NS.V034G1A?.groupsForUI?.(v,w)?.length||0),0);
 const numPeople=active.reduce((s,v)=>s+(v.residents||[]).filter(p=>p.alive!==false).length,0);
 const wars=w.v33War?.wars||[];
 d('h3WorldMetrics').innerHTML=metric('세계 인구',`${fmt(numPeople)}명`)+metric('생존 국가',`${active.length}개`)+metric('정착지',`${fmt(groups)}개`)+metric('소유 영토',`${territory}/${n(w.map?.tiles?.filter(t=>NS.TERRAIN?.[t.terrain]?.passable).length)||'—'}타일`)+metric('전쟁',`${wars.filter(x=>x.status==='ACTIVE').length}건 진행 · ${wars.length}건 누적`);
 const key=d('h3CompareSort')?.value||'population',include=d('h3CompareExtinct')?.checked||false;
 const nationRows=(include?w.villages:active).map(v=>{const people=(v.residents||[]).filter(p=>p.alive!==false),territory=v.territory?.size||0,tech=v.technologies?.size||0,gold=n(v.gold),market=[...(v.territory||[])].reduce((a,id)=>a+n(w.map.get(id)?.v29Economy?.marketGold),0),wallet=people.reduce((a,p)=>a+n(p.gold29),0);return{v,population:people.length,territory,tech,money:gold+market+wallet,gold,market,wallet};}).sort((a,b)=>b[key]-a[key]||a.v.id-b.v.id);
 d('h3CompareTable').innerHTML=`<table class="h3-table"><thead><tr><th>국가</th><th>인구</th><th>영토</th><th>기술</th><th>국고</th><th>시장</th><th>지갑</th><th>전체 Gold</th></tr></thead><tbody>${nationRows.map(r=>`<tr><td><button class="h3-nation-link" data-h3-nation="${Number(r.v.id)}"><span class="h4a-nation-bar" aria-hidden="true" style="background-color:${esc(String(NS.NATION_COLORS?.[Number(r.v.id)]||'#8293a7'))}"></span>${esc(r.v.name)}${r.v.status!=='active'?' · 멸망':''}</button></td><td>${fmt(r.population)}</td><td>${fmt(r.territory)}</td><td>${r.tech}/${NS.TECH_ORDER.length}</td><td>${fmt(r.gold,1)}</td><td>${fmt(r.market,1)}</td><td>${fmt(r.wallet,1)}</td><td>${fmt(r.money,1)}</td></tr>`).join('')}</tbody></table>`;
 d('h3CompareTable').querySelectorAll('[data-h3-nation]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.h3Nation);if(!w.villages?.some(v=>Number(v.id)===id&&v.status==='active'))return;ui.goNation?.(id,'overview');});
 refreshChronicle(ui);
}
function siteRows(w,war){const out=[],seen=new Set(),add=(id,kind)=>{id=Number(id);if(!Number.isInteger(id)||seen.has(id)||!exists(id,w))return;seen.add(id);out.push({id,kind});};
 for(const e of war.engagements33C||[])if(e.tileId!=null)add(e.tileId,'기록된 교전');
 for(const id of war.warGoal33F?.targetTileIds||[])add(id,'전쟁목표');
 for(const t of war.peaceSettlement33F?.cededTiles||[])add(t.tileId??t.id??t,'평화협정 양도');
 return out.slice(0,16);
}
function jumpToTile(ui,id){const t=ui.world?.map?.get?.(Number(id));if(!t)return;
 ui.world.selectedTileId=t.id;if(boolOwned(t))ui.world.selectedVillageId=t.ownerId;
 ui.view='map';ui.renderViews();const canvas=d('worldCanvas'),map=ui.world.map;
 if(canvas){const base=Math.min(canvas.width/map.width,canvas.height/map.height),z=Math.max(n(ui.zoom)||1,1.5),cell=base*z;ui.zoom=z;ui.offsetX=canvas.width/2-(t.x+.5)*cell-(canvas.width-map.width*cell)/2;ui.offsetY=canvas.height/2-(t.y+.5)*cell-(canvas.height-map.height*cell)/2;ui.renderMapView?.();}
 d('view-map')?.scrollIntoView?.({block:'start'});
}
function decorateWars(ui){if(ui.view!=='stats')return;const panel=d('v33aWarHistoryPanel');if(!panel)return;
 d('v33cEngagementHistoryPanel')?.remove();
 const list=[...(ui.world?.v33War?.wars||[])].sort((a,b)=>n(b.startCal)-n(a.startCal));
 const cards=[...panel.querySelectorAll('.v33a-history > .v33a-warcard')];
 cards.forEach((card,i)=>{const war=list[i];if(!war)return;let old=card.querySelector('.h3-sites');const sig=JSON.stringify([war.id,(war.engagements33C||[]).length,(war.warGoal33F?.targetTileIds||[]).join(','),war.peaceSettlement33F?.cededTiles?.length]);if(old?.dataset.h3Sig===sig)return;
 old?.remove();const box=document.createElement('div');box.className='h3-sites';box.dataset.h3Sig=sig;
 const places=siteRows(ui.world,war);box.innerHTML=`<div class="small muted">📍 실제 기록된 위치 · I3 세부 라운드는 종료 후 360일간만 보존됩니다.</div><div class="h3-site-links">${places.map(p=>`<button data-h3-war-tile="${p.id}">#${p.id} · ${esc(p.kind)} <span>지도에서 보기 ↗</span></button>`).join('')||'<span class="small muted">이 전쟁에 보존된 위치 정보가 없습니다.</span>'}</div>`;
 card.append(box);box.querySelectorAll('[data-h3-war-tile]').forEach(b=>b.onclick=()=>jumpToTile(ui,Number(b.dataset.h3WarTile)));
 });
}
// Use only already-collected snapshot error counters. No expensive per-header audits.
function refreshIntegrity(ui){const header=document.querySelector('.topbar'),w=ui.world;if(!header||!w)return;
 let b=d('h3IntegrityAlert');if(!b){b=document.createElement('button');b.id='h3IntegrityAlert';b.type='button';b.hidden=true;b.onclick=()=>{ui.view='world';ui.renderViews();d('h3Diagnostics').open=true;d('h3Advanced').open=true;d('h3Diagnostics').scrollIntoView?.({block:'nearest'});};header.append(b);}
 const latest=w.telemetry?.snapshots?.at(-1)?.global||{};
 const names=['settlementRegistryErrors34B','settlementErrors34C','global.equipmentConservationErrors33I1','global.equipmentConservationErrors33I1A1'];let bad=[];
 for(const k of names){if(Object.prototype.hasOwnProperty.call(latest,k)&&n(latest[k])>0)bad.push(`${k}: ${n(latest[k])}`);}
 const manual=ui._h3LastAudit?.world===w?ui._h3LastAudit:null;
 if(manual?.errors?.length){bad.push('수동 검사: '+manual.errors.length+'건');}
 const caution=manual?.warnings?.length||0;
 if(bad.length){b.hidden=false;b.dataset.level='error';b.textContent=`⚠ 무결성 오류 ${bad.length}종`;b.title=bad.join(' · ')+' · 마지막 Snapshot/수동 검사 기준';b.setAttribute('aria-label',b.title);}
 else if(caution){b.hidden=false;b.dataset.level='warning';b.textContent=`⚠ 저장 경고 ${caution}건`;b.title='수동 검사 기준: '+manual.warnings.slice(0,5).join(' · ');b.setAttribute('aria-label',b.title);}
 else{b.hidden=true;b.removeAttribute('title');}
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const out=oldSerialize.apply(this,a);out.version=VERSION;return out;};
NS.World.from=function(input,...a){return oldFrom.call(this,input?.version===VERSION?{...input,version:PREV}:input,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const out=oldJSON.apply(this,a);out.version=VERSION;out.worldSummary.v034h3Revision='world-statistics-ui-consolidation-v1';return out;};
function download(name,obj){const u=URL.createObjectURL(new Blob([JSON.stringify(obj)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},export(w){download(`village-observer-v034H3-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){download(`village-observer-v034H3-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
function refreshVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=d('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
if(P){const prevViews=P.renderViews,prevWorld=P.renderWorld,prevHeader=P.renderHeader;
 P.renderViews=function(...a){const r=prevViews.apply(this,a);ensureWorldShell(this);moveObservationPanels();if(this.view==='world')refreshWorld(this);if(this.view==='stats')decorateWars(this);return r;};
 P.renderWorld=function(...a){const r=prevWorld.apply(this,a);ensureWorldShell(this);if(this.view==='world')refreshWorld(this);return r;};
 P.renderHeader=function(...a){const r=prevHeader.apply(this,a);refreshVersion();moveObservationPanels();refreshIntegrity(this);return r;};}
NS.V034H3=Object.freeze({version:VERSION,readOnly:true,refreshWorld,decorateWars,jumpToTile,refreshIntegrity});
if(typeof document!=='undefined'){
 const css=document.createElement('style');css.textContent=`
.h3-world-root{display:grid;gap:12px}.h3-panel{margin:0}.h3-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:9px}.h3-metric{display:grid;gap:4px;padding:12px;border-radius:9px;border:1px solid var(--line,#46617a);background:rgba(88,135,176,.10)}.h3-metric span{font-size:12px;color:var(--muted,#a8bacc)}.h3-metric strong{font-size:18px}.h3-tools{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:9px 0}.h3-tools label{display:flex;align-items:center;gap:6px;font-size:12px}.h3-tools select{min-height:34px;background:#14273b;color:#eef6ff;border:1px solid var(--line,#42566d);border-radius:7px}.h3-table-wrap{max-width:100%;overflow-x:auto}.h3-table{border-collapse:collapse;width:100%;min-width:680px;font-size:12px}.h3-table th,.h3-table td{padding:9px 7px;border-bottom:1px solid var(--line,#40546b);text-align:right;white-space:nowrap}.h3-table td:first-child,.h3-table th:first-child{text-align:left}.h3-nation-link{background:none;border:0;color:#9ecfff;cursor:pointer;text-decoration:underline;padding:2px}.h3-chronicle{max-height:440px;overflow-y:auto}.h3-history-item{padding:8px 4px;border-bottom:1px solid var(--line,#364c63);font-size:12px}.h3-history-item span{display:inline-block;min-width:95px;margin-right:6px;color:var(--muted,#9cb4cc)}.h3-group{border:1px solid var(--line,#41526b);border-radius:10px;overflow:hidden}.h3-group>summary{padding:15px;cursor:pointer;font-weight:700;background:rgba(87,128,166,.15)}.h3-group>summary span{display:block;font-size:11px;font-weight:400;color:var(--muted,#9ab1c7);margin-top:4px}.h3-group>.panel,.h3-group>.h3-group{margin:12px}.h3-group:not([open]){padding-bottom:0}.h3-site-links{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.h3-site-links button{font-size:11px;padding:5px 8px}.h3-site-links span{font-size:10px;color:var(--muted,#9ab1c7)}.h3-sites{padding-top:8px;margin-top:8px;border-top:1px solid var(--line,#314c63)}#h3IntegrityAlert{color:#ffe0bb;background:#693d20;border:1px solid #b87f3d;padding:6px 10px;border-radius:8px;margin-left:8px}#h3IntegrityAlert[data-level=error]{background:#652d34;border-color:#b85963;color:#ffe5e5}.h3-audit-err{color:#ffabae}.h3-audit-warn{color:#ffdda0;margin-top:3px}#h3AuditOutput{margin-top:8px}#h3IntegrityAlert[hidden]{display:none!important}
@media(max-width:650px){.h3-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.h3-metric strong{font-size:15px}.h3-history-item span{display:block;margin-bottom:2px}.h3-group>.panel,.h3-group>.h3-group{margin:7px}}
`;document.head.appendChild(css);
}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-19',title:'세계·통계 UI 통합 V1',summary:'세계 현황·국가별 Gold 분리 비교·연대기 필터, 실제 전쟁/전장 지도 연결, F0/F1·개발자 도구 배치 통합. 시뮬레이션·RNG·무결성 계산 불변.',sections:[['세계',['현재 인구·정착지·영토·전쟁 집계 표시','국가별 인구·영토·기술·국고/시장/지갑 Gold 분리 비교','보존된 연대기의 사건 분류·최근 80개만 표시']],['전쟁 기록',['구형 C 지속 교전 별도 패널 제거, E/F 최신 공식 전쟁기록 보존','실제로 보존된 교전·목표·할양 타일을 지도로 선택','I3 세부 라운드 360일 보존 범위를 명시']],['성능·도구',['F0/F1의 실제 DOM을 세계 탭으로 이동하고 기존 이벤트·수집 경로 보존','저장/CSV/Devlog·AI 프로필·관찰자 개입 기존 버튼 보존','기존 Snapshot 오류 계측값을 이용한 상단 경고만 표시']],['보존',['H2A 세이브 복구·H1 지도·H2 국가 UI·43개 기술 유지','Gold·자원·Person·군사·AI·RNG·CSV 1683열 불변','석재 저장량 초과는 원인 미확정이므로 이번 범위 제외']]]});
try{refreshVersion();const ui=window.villageObserver;if(ui){ensureWorldShell(ui);moveObservationPanels();ui.view==='world'&&refreshWorld(ui,true);ui.view==='stats'&&decorateWars(ui);}}catch(e){console.warn('H3 initial UI mounting',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h4.js */
/* Village Observer V0.34H4 — bounded integrity/performance stabilization.
 * D3 audit diagnosis is observational and runs only on explicit request/export.
 * D3 member/cache/capacity optimizations are semantics-preserving and verified
 * against unmodified H3 with an identical seed and serialized world state.
 */
(function(NS){'use strict';
const VERSION='V0.34H4', PREV='V0.34H3',KEY='village-observer-v034h4';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
const n=x=>Number.isFinite(Number(x))?Number(x):0;
// Model the maximum physical capacity if existing intact but inactive storage buildings
// are restored. This is NOT extra storage granted to the simulation.
function potentialStoneCap(t){
 let total=25;
 for(const b of t?.buildings||[]){
  let add=n(NS.BUILDINGS?.[b]?.storage?.stone);
  if(b==='warehouse'&&t?._v08UrbanStorage)add*=1.15;
  total+=add;
 }
 return total;
}
function storageDiagnosis(w){
 const entries=[];
 for(const r of NS.V034D3.economyRows(w)){
  const current=n(r.capacity?.stone),stock=n(r.resources?.stone),excess=Math.max(0,stock-current);
  if(excess<=1e-5)continue;
  const physicalPotential=(r.tileIds||[]).reduce((s,id)=>s+potentialStoneCap(w.map?.get(Number(id))),0);
  const possibleCapacityContraction=stock<=physicalPotential+1e-5;
  entries.push({settlementId:r.settlementId,nationId:r.nationId,stock,currentCap:current,excess,physicalPotential,classification:possibleCapacityContraction?'POSSIBLE_CAPACITY_CONTRACTION':'UNEXPLAINED_OVERFLOW',
   tileIds:[...(r.tileIds||[])]});
 }
 return entries;
}
function audit(w){
 const base=NS.V034D3.audit(w),storage=storageDiagnosis(w);
 const tag=new Map(storage.map(r=>[r.settlementId,r.classification]));
 // Keep original STORAGE_OVERFLOW for backward-compatible telemetry, add diagnosis;
 // nothing here writes inventory, capacity, RNG, or building condition.
 return {...base,storage,storageSummary:{total:storage.length,possibleContraction:storage.filter(x=>x.classification==='POSSIBLE_CAPACITY_CONTRACTION').length,unexplained:storage.filter(x=>x.classification==='UNEXPLAINED_OVERFLOW').length,totalExcess:storage.reduce((x,r)=>x+r.excess,0)},
  warnings:(base.warnings||[]).map(x=>{const match=String(x).match(/^STORAGE_OVERFLOW:([^:]+):stone$/);return match?x+' ['+(tag.get(match[1])||'NOT_CLASSIFIED')+']':x;})};
}
NS.World.prototype.serialize=function(...args){const data=oldSerialize.apply(this,args);data.version=VERSION;return data;};
NS.World.from=function(data,...args){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const data=oldJSON.apply(this,args);data.version=VERSION;if(data.worldSummary){data.worldSummary.v034h4Revision='stone-capacity-diagnosis-and-d3-member-cap-fastpath';
 // Full storage analysis only for an explicit devlog export, never every simulation day.
 if(args[0])data.worldSummary.v034h4StorageDiagnosis=storageDiagnosis(args[0]);}return data;};
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},
 load(){const text=localStorage.getItem(KEY);return text?NS.World.from(JSON.parse(text)):oldSave.load?.();},
 export(w){download(`village-observer-v034H4-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v034H4-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
NS.RELEASE_VERSION=VERSION;
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}
/* H1B2: redundant version-only UI wrapper omitted */
NS.V034H4=Object.freeze({version:VERSION,audit,storageDiagnosis,potentialStoneCap});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-19',title:'장기 무결성·경제권 경량화',summary:'석재 저장 초과를 보존하면서 가동 건물의 저장용량 감소 가능성과 설명되지 않는 초과를 구분합니다. D3 공동 Settlement 조회와 창고용량 중복 계산을 줄입니다.',sections:[
 ['석재 감사',['기존 재고를 절대 삭제하거나 저장용량을 임의 확장하지 않습니다.','건물 상태 악화로 저장 용량이 낮아질 수 있는 정착지와 현존 시설만으로 설명되지 않는 초과를 분리합니다.','실제 88년 Save JSON이 없으므로 기존 경고 5건의 최종 원인 확정은 유보합니다.']],
 ['성능',['공동 Settlement 타일 회원 검색에 Set 조회를 이용하고 저장용량 6종을 시설별 한 번만 산출합니다.','AI·전쟁·생산·물류·Person 의사결정 및 난수 순서는 그대로 유지합니다.']],
 ['검증',['H3 대비 동일 시드·세이브 30일 parity 및 H2A 복구 회귀를 유지합니다.','150년/실제 88년 장기 성능 목표는 별도 동일 PC·세이브 환경에서 검증해야 합니다.']]
]});
try{refresh();}catch(e){console.warn('H4 header',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h4a.js */
/* Village Observer V0.34H4A — storage provenance diagnostics + map/stats polish.
 * All state tracking is read-only and non-serialized. No resource/AI/RNG mutations.
 * Historical causes before this release cannot be reconstructed from current stock.
 */
(function(NS){'use strict';
const VERSION='V0.34H4A',PREV='V0.34H4',KEY='village-observer-v034h4a';
const P=NS.UI?.prototype,track=new WeakMap();
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>n(x).toLocaleString('ko-KR',{maximumFractionDigits:2});
const color=v=>String((NS.NATION_COLORS||[])[Number(v?.id)]||'#8293a7');
const canonicalDay=w=>Number(w?.calendarOrdinalDay?.()??((Number(w?.year||1)-1)*360+(Number(w?.quarter||w?.season||1)-1)*90+Number(w?.day||1)));
function topology(w){const c=w?.v34c?.counters||{};return [n(c.ownershipChanges),n(c.merges),n(c.splits)].join('/');}
function currentRows(w){return NS.V034H4.storageDiagnosis(w);}
function watch(w,reason='BASELINE',force=false){if(!w)return null;let z=track.get(w);if(!z){z={records:[],last:new Map(),topology:topology(w),lastPeriod:-Infinity};track.set(w,z);force=true;reason='PREEXISTING_AT_FIRST_OBSERVATION';}
 const day=canonicalDay(w),sig=topology(w),changed=sig!==z.topology,period=day-z.lastPeriod>=30;
 if(!force&&!changed&&!period)return z;
 const rows=currentRows(w),now=new Map(rows.map(r=>[String(r.settlementId),r]));
 for(const r of rows){const previous=z.last.get(String(r.settlementId));if(!previous||r.excess>previous.excess+1e-5||r.excess<previous.excess-1e-5||r.currentCap!==previous.currentCap||r.stock!==previous.stock){
  const type=!previous?(reason==='PREEXISTING_AT_FIRST_OBSERVATION'?'PREEXISTING_AT_FIRST_OBSERVATION':'NEWLY_OBSERVED_OVERFLOW'):r.excess>previous.excess+1e-5?'OBSERVED_EXCESS_INCREASE':r.excess<previous.excess-1e-5?'OBSERVED_EXCESS_DECREASE':'OBSERVED_STOCK_OR_CAP_CHANGE';
  z.records.push({day,simTime:w.timestamp?.()||'',type,trigger:reason==='BASELINE'&&changed?'SETTLEMENT_TOPOLOGY_CHANGED':reason==='BASELINE'&&period?'PERIODIC_30D_OBSERVATION':reason,settlementId:r.settlementId,nationId:r.nationId,tileIds:r.tileIds,stock:r.stock,currentCap:r.currentCap,excess:r.excess,classification:r.classification,previous:previous?{stock:previous.stock,currentCap:previous.currentCap,excess:previous.excess}:null});
 }}
 for(const [id,old] of z.last)if(!now.has(id))z.records.push({day,type:'OVERFLOW_NO_LONGER_PRESENT',settlementId:id,previousExcess:old.excess,trigger:reason});
 if(z.records.length>96)z.records.splice(0,z.records.length-96);
 z.last=now;z.topology=sig;z.lastPeriod=day;return z;
}
// Only inspect the economy on a real topology change, a 30-calendar-day cadence,
// or an explicit user request/export. Do not scan each Person or per UI render.
const advance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){watch(this);const out=advance.apply(this,args);watch(this);return out;};
function relevantEvents(w,tiles,limit=70){const set=new Set(tiles.map(Number));const ev=w?.telemetry?.entries||[];const out=[];for(let i=ev.length-1;i>=0&&out.length<limit;i--){const e=ev[i],p=e.payload||{};if(!/SETTLEMENT|OUTPOST|FRONTIER|TILE_CEDED|TERRITORY|BUILDING|OWNERSHIP|CONQUEST|PEACE_SETTLEMENT/i.test(String(e.type||'')))continue;const ids=[p.tileId,p.fromTileId,p.toTileId,p.targetTileId,...(p.tileIds||[]),...(p.cededTileIds||[])].filter(x=>x!=null).map(Number);if(!ids.some(id=>set.has(id)))continue;out.push({type:e.type,simTime:e.simTime||e.calendarDate24||'',tileIds:ids.filter(x=>set.has(x)),settlementId:p.settlementId??null,building:p.building??p.type??null});}return out.reverse();}
function diagnosis(w){
 watch(w,'MANUAL_DIAGNOSTIC',true);
 const rows=currentRows(w);
 const tiles=[...new Set(rows.flatMap(r=>r.tileIds||[]))].map(Number);
 const byNation=new Map((w.villages||[]).map(v=>[Number(v.id),v]));
 return {
  format:'vilob-h4a-storage-diagnostic-v1',version:VERSION,simTime:w.timestamp?.()||'',
  note:'Causes before H4A are unknown; the classification is not proof of how resources arrived. Read-only physical stock.',
  world:{mapSize:[w.map.width,w.map.height],overflowSettlements:rows.length,overflowStone:rows.reduce((s,r)=>s+r.excess,0)},
  settlements:rows.map(r=>{
   const v=byNation.get(Number(r.nationId));
   return {...r,nationName:v?.name||null,tiles:(r.tileIds||[]).map(raw=>{
    const t=w.map.get(Number(raw));
    return {
     id:Number(raw),ownerId:t?.ownerId,settlementId:t?.settlementId,terrain:t?.terrain,
     stocks:Object.fromEntries(Object.entries(t?.stocks||{}).map(([k,val])=>[k,n(val)])),
     stonePhysicalCap:v?NS.V034D3.physicalCap(v,Number(raw),'stone'):null,
     buildings:(t?.buildings||[]).map((b,i)=>({type:b,condition:n(t?.buildingCondition?.[i]),stoneStorage:n(NS.BUILDINGS?.[b]?.storage?.stone)}))
    };
   })};
  }),
  observations:[...(track.get(w)?.records||[])],relatedEvents:relevantEvents(w,tiles)
 };
}

function saveFile(filename,data){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function ensureAudit(ui){if(typeof document==='undefined')return;const run=document.getElementById('h3AuditRun'),out=document.getElementById('h3AuditOutput'),host=document.getElementById('h3AuditCheck');if(!run||!out||!host)return;
 if(!run.dataset.h4aBound){run.dataset.h4aBound='1';run.onclick=()=>{try{const w=ui.world,c=NS.V034C.inspect(w),d2=NS.V034D2.audit(w),h4=NS.V034H4.audit(w),errors=[...(c.errors||[]).map(e=>'C: '+String(e.code||e)),...(d2.errors||[]).map(e=>'D2: '+e),...(h4.errors||[]).map(e=>'D3: '+e)],warnings=[...(h4.warnings||[])];ui._h3LastAudit={world:w,errors,warnings,when:w.timestamp?.()||''};out.innerHTML=`<div>검사 시점 ${esc(ui._h3LastAudit.when)} · <strong>${errors.length?'오류 '+errors.length+'건':'무결성 오류 0건'}</strong> · 주의 ${warnings.length}건</div>`+errors.slice(0,12).map(e=>`<div class="h3-audit-err">${esc(e)}</div>`).join('')+h4.storage.map(r=>`<div class="h3-audit-warn">${esc(r.settlementId)} · ${esc(r.classification)} · 석재 ${fmt(r.stock)} / 용량 ${fmt(r.currentCap)} · 초과 ${fmt(r.excess)}</div>`).join('')+warnings.filter(x=>!String(x).startsWith('STORAGE_OVERFLOW:')).slice(0,12).map(e=>`<div class="h3-audit-warn">${esc(e)}</div>`).join('');watch(w,'MANUAL_AUDIT',true);NS.V034H3?.refreshIntegrity?.(ui);}catch(e){out.textContent='검사 실패: '+String(e?.message||e);}};}
 if(!document.getElementById('h4aExportStorage')){const btn=document.createElement('button');btn.id='h4aExportStorage';btn.type='button';btn.textContent='석재 저장 경량 진단 JSON 내보내기';btn.style.marginLeft='8px';btn.onclick=()=>{const w=ui.world;saveFile(`vilob-h4a-storage-${w.year}y.json`,diagnosis(w));};run.insertAdjacentElement('afterend',btn);}
}
function strokeNationalBorders(ui){if((ui.h1BoundaryMode||'all')!=='all')return;const w=ui.world,g=ui._mapGeom,canvas=ui.q?.('worldCanvas');if(!w||!g||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx||!g.cell)return;
 const {cell,ox,oy}=g;ctx.save();ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);ctx.clip();ctx.beginPath();let edges=0;
 for(const t of w.map.tiles){if(t.ownerId==null)continue;for(const [dx,dy] of [[1,0],[0,1]]){const other=w.map.at(t.x+dx,t.y+dy);if(!other||other.ownerId==null||String(t.ownerId)===String(other.ownerId))continue;
  const x=ox+(t.x+(dx?1:0))*cell,y=oy+(t.y+(dy?1:0))*cell;ctx.moveTo(x,y);ctx.lineTo(x+(dy?cell:0),y+(dx?cell:0));edges++;}}
 if(edges){ctx.strokeStyle='#000000';ctx.lineWidth=Math.max(2.3,cell*.115)*.70;ctx.lineJoin='round';ctx.lineCap='square';ctx.globalAlpha=1;ctx.stroke();}ctx.restore();}
function statsDecorate(ui){if(ui.view!=='stats'||!ui.world)return;const sel=document.getElementById('statsNation');if(!sel)return;
 let bar=document.getElementById('h4aSelectedNationBar');if(!bar){bar=document.createElement('span');bar.id='h4aSelectedNationBar';bar.className='h4a-nation-bar';bar.setAttribute('aria-hidden','true');sel.insertAdjacentElement('beforebegin',bar);}bar.style.backgroundColor=color(ui.world.villages?.find(v=>Number(v.id)===Number(sel.value)));
 let legend=document.getElementById('h4aNationLegend');if(!legend){legend=document.createElement('div');legend.id='h4aNationLegend';legend.className='h4a-nation-legend';legend.setAttribute('aria-label','국가별 색상과 통계 선택');const target=sel.closest('.panel')||sel.parentElement;target?.appendChild(legend);}
 const sig=(ui.world.villages||[]).map(v=>[v.id,v.name,color(v)].join(':')).join('|');if(legend.dataset.signature!==sig){legend.dataset.signature=sig;legend.replaceChildren();for(const v of ui.world.villages||[]){const b=document.createElement('button');b.type='button';b.className='h4a-nation-choice';b.dataset.nation=String(v.id);const mark=document.createElement('span');mark.className='h4a-nation-bar';mark.style.backgroundColor=color(v);mark.setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=v.name;b.append(mark,label);b.onclick=()=>{sel.value=String(v.id);sel.dispatchEvent(new Event('change',{bubbles:true}));};legend.appendChild(b);}}
 const visible=ui.statsScope!=='world';bar.hidden=!visible;legend.hidden=!visible;for(const b of legend.querySelectorAll('[data-nation]'))b.setAttribute('aria-pressed',String(b.dataset.nation===sel.value));}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const data=oldSerialize.apply(this,a);data.version=VERSION;return data;};
NS.World.from=function(data,...a){const w=oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...a);watch(w,'LOADED_WORLD',true);return w;};
NS.Telemetry.prototype.toJSON=function(...a){const data=oldJSON.apply(this,a);data.version=VERSION;if(data.worldSummary){data.worldSummary.v034h4aRevision='storage-provenance-lightweight-export-and-national-boundary-stats-polish';if(a[0]){const z=watch(a[0],'DEVLOG_EXPORT',true);data.worldSummary.v034h4aStorageObservation={count:z?.records?.length||0,recent:z?.records?.slice(-16)||[]};}}return data;};
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},export(w){saveFile(`village-observer-v034H4A-save-${w.year}y.json`,w.serialize());},exportDevJSON(w){saveFile(`village-observer-v034H4A-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}};
NS.RELEASE_VERSION=VERSION;
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
if(P){const prevMap=P.renderMap,prevStats=P.renderStats,prevViews=P.renderViews,prevWorld=P.renderWorld,prevHeader=P.renderHeader;
 P.renderMap=function(...a){const out=prevMap.apply(this,a);strokeNationalBorders(this);return out;};
 P.renderStats=function(...a){const out=prevStats.apply(this,a);statsDecorate(this);return out;};
 P.renderViews=function(...a){const out=prevViews.apply(this,a);ensureAudit(this);statsDecorate(this);return out;};
 P.renderWorld=function(...a){const out=prevWorld.apply(this,a);ensureAudit(this);return out;};
 P.renderHeader=function(...a){const out=prevHeader.apply(this,a);refresh();return out;};
}
NS.V034H4A=Object.freeze({version:VERSION,diagnosis,watch,strokeNationalBorders,statsDecorate});
if(typeof document!=='undefined'){const style=document.createElement('style');style.textContent=`.h4a-nation-legend{display:flex;flex-wrap:wrap;gap:5px 9px;margin:9px 0}.h4a-nation-choice{display:inline-flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line,#41526b);border-radius:6px;padding:5px 8px;background:transparent;color:inherit;cursor:pointer}.h4a-nation-choice[aria-pressed=true]{border-color:#98c8ff;background:rgba(74,144,220,.15)}.h4a-nation-bar{display:inline-block;flex:none;width:4px;height:16px;border-radius:1px;margin-right:4px;vertical-align:middle}.h4a-nation-legend[hidden],.h4a-nation-bar[hidden]{display:none!important}@media(max-width:650px){.h4a-nation-choice{font-size:11px;padding:5px 7px}}`;document.head.appendChild(style);}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'석재 저장 원인 추적·지도 국경·통계 색상',summary:'기존 석재 재고 보존, 저장 초과 경량 진단 JSON, 원인 분류 포함 수동 감사, 국가 간 검은 경계 및 통계 색상 막대',sections:[['저장 무결성',['용량 초과 재고는 삭제·강제 이전하지 않습니다.','이미 발생한 초과는 H4A 최초 관측 이전 원인 확정 불가로 표시합니다.','정착지 소유권·병합·분할 변화와 30일 관측에 의한 초과 변동 추적, 경량 JSON으로 타일 실물 재고·건물·관련 사건 추출합니다.']],['지도',['정착지 경계 전체 모드에서 다른 국가 간 경계는 정착지 테두리 위에 검은 실선으로 표시합니다.','선택 강조·기타 지도 모드는 변경하지 않습니다.']],['통계',['국가명 왼쪽의 세로 국가색 막대와 국가 선택 보조 목록을 제공합니다.','기존 선택 드롭다운·필터·스크롤은 보존하고 사용자 정의 국가색을 반영합니다.']],['검증',['H4 대비 시뮬레이션 RNG 및 세계 상태를 보존합니다.','석재 원인 확정은 실제 이전 시점의 자료가 없는 경우 유보합니다.']]]});
try{refresh();const ui=window.villageObserver;if(ui){ensureAudit(ui);statsDecorate(ui);}}catch(e){console.warn('H4A init',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h4b.js */
/* Village Observer V0.34H4B — settlement/nation border refinement + world nation markers + overflow provenance validation.
 * Rule changes: NONE. Pre-H4A history is observation-only; do not delete or fabricate resources.
 */
(function(NS){'use strict';
const VERSION='V0.34H4B',PREV='V0.34H4A',KEY='village-observer-v034h4b';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldSave=NS.SaveSystem,oldToJSON=NS.Telemetry.prototype.toJSON;
NS.World.prototype.serialize=function(...args){const result=oldSerialize.apply(this,args);result.version=VERSION;return result;};
NS.World.from=function(data,...args){return oldFrom.call(this,data?.version===VERSION?{...data,version:PREV}:data,...args);};
const saveFile=(name,obj)=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 용량 초과: JSON 파일로 내보내 주세요 ('+e.message+')');}},
 load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},
 export(w){saveFile(`village-observer-v034H4B-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){saveFile(`village-observer-v034H4B-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));}
};
NS.Telemetry.prototype.toJSON=function(...args){const data=oldToJSON.apply(this,args);data.version=VERSION;
 if(data.worldSummary){data.worldSummary.v034h4bRevision='border-thickness-minus-30pc-world-nation-color-markers-and-stock-provenance-tests';
 data.worldSummary.v034h4bStoragePolicy='Over-capacity physical stone remains conserved on tile abandonment/reclaim; no stock correction; use H4A observer for preexisting overflows.';}
 return data;};
NS.RELEASE_VERSION=VERSION;
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
const P=NS.UI?.prototype;if(P){const oldHeader=P.renderHeader;P.renderHeader=function(...args){const out=oldHeader.apply(this,args);refresh();return out;};}
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'경계 가독성·세계 국가색·석재 저장 경로 검증',summary:'정착지 전체 경계와 검정 국경 모두 약 30% 축소, 세계 국가 비교에 실제 국가색 수직 막대 추가, 석재 재고의 포기·재개척·병합 경로 재현 및 보존 정책 유지.',sections:[['지도',['정착지 경계 전체 모드의 내부 색상선과 외곽 윤곽선은 기존 대비 70%로 조정합니다.','서로 다른 국가 사이의 최종 검은색 테두리도 기존 대비 70%로 줄입니다.','선택 강조 모드와 기타 지도 모드는 유지합니다.']],['세계',['세계 국가 비교의 국가명 왼쪽에 통계 탭과 동일한 국가색 막대를 표시합니다.','실제 국가의 국가색, 정렬, 멸망국 필터, 국가 탭 이동은 유지합니다.']],['석재',['기존 타일의 석재는 영토 포기·재개척 후에도 실물로 남을 수 있습니다.','단순 과잉 재고를 자원 생성 오류로 간주하지 않으며 초과분을 삭제하지 않습니다.','H4A 경량 진단과 신규 초과 관측은 계속 사용할 수 있습니다.']],['검증',['H4A 대비 게임 상태와 RNG 동일성, 건물·정착지 연결·세이브 회귀를 확인합니다.']]]});
NS.V034H4B=Object.freeze({version:VERSION,boundaryFactor:0.70,storagePolicy:'PRESERVE_STOCK_ON_ABANDONMENT'});
try{refresh();}catch(e){console.warn('H4B init',e);}
})(window.VSim);

;
/* H1B2 bundled source: v034h4c.js */
/* Village Observer V0.34H4C — conserved legacy stone overflow relocation + neutral/water borders.
 * Existing over-cap stock remains physically stored; NEW ordinary deposits obey the
 * total active Settlement capacity. Real same-nation routes move only excess stock.
 */
(function(NS){'use strict';
const VERSION='V0.34H4C',PREV='V0.34H4B',KEY='village-observer-v034h4c';
const EPS=1e-7,n=x=>Number.isFinite(Number(x))?Number(x):0;
const same=(a,b)=>String(a)===String(b);
const data=new WeakMap(),bypass=new WeakMap();
function stats(w){let s=data.get(w);if(!s){s={pulses:0,shipments:0,quantity:0,blockedDeposits:0,blockedQuantity:0,physicalMismatch:0,failedReturns:0,blocked:{},latest:[],lastDay:null};data.set(w,s);}return s;}
function block(s,why){s.blocked[why]=(s.blocked[why]||0)+1;}
function tileOK(v,t){return !!(t&&same(t.ownerId,v.id)&&(t.v33OccupierId==null||same(t.v33OccupierId,v.id)));}
function group(v,tid){const w=v._world,t=w?.map?.get(Number(tid));if(!tileOK(v,t))return null;
 const m=NS.V034D3?.members?.(v,Number(tid));const ids=m?.ids?.length?m.ids.map(Number):[Number(tid)];
 return {id:String(m?.sid??'tile:'+tid),ids,anchor:Number(m?.core??ids[0]),nationId:v.id};
}
function stock(w,ids){return ids.reduce((s,id)=>s+Math.max(0,n(w.map.get(id)?.stocks?.stone)),0);}
function cap(v,ids){return ids.reduce((s,id)=>s+n(NS.V034D3?.physicalCap?.(v,id,'stone')??v.settlementCaps(id).stone),0);}
const previousDeposit=NS.Village.prototype.depositAt;
// Conserved rollback is permitted ONLY inside an explicit physical transaction.
// Do not allow a general production call to relabel itself as a return.
function withReturn(v,fn){const old=bypass.get(v)||0;bypass.set(v,old+1);try{return fn();}finally{if(old)bypass.set(v,old);else bypass.delete(v);}}
NS.Village.prototype.depositAt=function(id,k,qty){
 if(k==='stone'&&(bypass.get(this)||NS.V034D3A?.isReturning?.(this._world,this))){
  // Returning PREEXISTING physical stock to its original owner is legal even
  // when the ordinary storage capacity shrank. The native tile deposit will
  // accept what fits; any remaining rollback is restored on the physical tile.
  const t=this._world?.map.get(Number(id)),allowed=t&&tileOK(this,t)?Math.max(0,n(qty)):0;
  if(allowed<=EPS)return 0;
  const put=n(previousDeposit.call(this,id,k,allowed));
  if(allowed>put+EPS){t.stocks=t.stocks||{};t.stocks.stone=n(t.stocks.stone)+(allowed-put);}
  return allowed;
 }
 if(k!=='stone')return previousDeposit.call(this,id,k,qty);
 const g=group(this,id);if(!g)return previousDeposit.call(this,id,k,qty);
 const available=Math.max(0,cap(this,g.ids)-stock(this._world,g.ids));
 const want=Math.max(0,n(qty)),allowed=Math.min(want,available);
 if(want>allowed+EPS){const s=stats(this._world);s.blockedDeposits++;s.blockedQuantity+=want-allowed;}
 return allowed>EPS?previousDeposit.call(this,id,k,allowed):0;
};
// V034D3A returns rejected intra-network stones with RETURN context; its handler
// invokes depositAt again, so preserve that exact already-owned stock as well.
const originalTransfer=NS.V034D3A?.transferWithReturn;
if(originalTransfer){
 // The original D3A handler does not export its internal RETURN context. A
 // dedicated stone transport path below avoids relying on this legacy behavior.
}
function groups(v,w){const map=new Map();for(const raw of v.territory||[]){const tid=Number(raw),t=w.map.get(tid);if(!tileOK(v,t))continue;
 const g=group(v,tid);if(!g)continue;let row=map.get(g.id);if(!row){row={id:g.id,ids:[],anchor:tid};map.set(g.id,row);}row.ids.push(tid);
 }
 return [...map.values()].map(g=>{g.ids.sort((a,b)=>a-b);g.anchor=g.ids[0];g.stock=stock(w,g.ids);g.cap=cap(v,g.ids);g.excess=Math.max(0,g.stock-g.cap);g.room=Math.max(0,g.cap-g.stock);return g;});}
function route(v,w,source,target){let best=null;
 for(const a of source.ids)for(const b of target.ids){const ta=w.map.get(a),tb=w.map.get(b);if(!tileOK(v,ta)||!tileOK(v,tb))continue;
 const q=v.internalLogisticsCapacity?.(a,b,'stone',false),cost=Number(q?.cost),capacity=n(q?.capacity);
 if(!Number.isFinite(cost)||capacity<=EPS||q.reason==='D3_SHARED_POOL_NO_SHIPMENT')continue;
 if(!best||cost<best.cost-EPS||Math.abs(cost-best.cost)<EPS&&capacity>best.capacity)best={from:a,to:b,cost,capacity};
 }
 return best;
}
function restorePhysical(v,oldValues){let restored=0;for(const [id,amount] of oldValues){const t=v._world.map.get(id);if(t){const before=n(t.stocks?.stone);if(!t.stocks)t.stocks={};t.stocks.stone=amount;restored+=Math.max(0,amount-before);}}return restored;}
function move(v,w,src,dst,choice,limit){
 if(!choice||src.id===dst.id||!Number.isFinite(choice.cost))return 0;
 const beforeSrc=stock(w,src.ids),beforeDst=stock(w,dst.ids),allowed=Math.min(beforeSrc-cap(v,src.ids),cap(v,dst.ids)-beforeDst,n(choice.capacity),n(limit));
 if(allowed<=EPS)return 0;
 const snapshot=[...new Set([...src.ids,...dst.ids])].map(id=>[id,n(w.map.get(id)?.stocks?.stone)]);
 // Only the source pool supplies stone; the destination uses the native D3 deposit
 // so each accepted unit is real physical inventory, never an accounting phantom.
 const removed=n(v.withdrawAt(choice.from,'stone',allowed));
 const added=n(v.depositAt(choice.to,'stone',removed));
 if(removed-added>EPS){const s=stats(w);s.failedReturns++;restorePhysical(v,snapshot);block(s,'TRANSACTION_ROLLBACK');return 0;}
 const delta=(stock(w,src.ids)+stock(w,dst.ids))-(beforeSrc+beforeDst);
 if(Math.abs(delta)>1e-5){const s=stats(w);s.physicalMismatch++;restorePhysical(v,snapshot);block(s,'CONSERVATION_ROLLBACK');return 0;}
 return added;
}
const time=w=>n(w.calendarOrdinalDay?.()??((n(w.year)-1)*360+(n(w.quarter)-1)*90+n(w.day)));
function redistribute(w,{force=false}={}){
 if(!w)return null;const s=stats(w),day=time(w);if(!force&&(day%3!==0||day===s.lastDay))return s;
 s.lastDay=day;s.pulses++;
 for(const v of w.activeVillages||[]){const all=groups(v,w),sources=all.filter(g=>g.excess>EPS).sort((a,b)=>b.excess-a.excess||a.anchor-b.anchor);if(!sources.length)continue;
 let sent=0;for(const src of sources){if(sent>=3)break;
  let rem=Math.max(0,stock(w,src.ids)-cap(v,src.ids));if(rem<=EPS)continue;
  // Cheap geographic shortlist before expensive path search. Retry a second
  // group if the nearest targets are disconnected/occupied, not every nation tile.
  const options=all.filter(dst=>dst.id!==src.id&&cap(v,dst.ids)-stock(w,dst.ids)>EPS)
   .map(dst=>({dst,proximity:Math.min(...src.ids.flatMap(id=>dst.ids.map(j=>{
    const a=w.map.get(id),b=w.map.get(j);return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
   })))})).sort((a,b)=>a.proximity-b.proximity||a.dst.anchor-b.dst.anchor);
  let reachable=[];
  for(let start=0;start<options.length&&reachable.length===0&&start<24;start+=12){
   reachable=options.slice(start,start+12).map(({dst})=>({dst,way:route(v,w,src,dst)})).filter(x=>x.way);
  }
  reachable.sort((a,b)=>a.way.cost-b.way.cost||b.dst.room-a.dst.room||a.dst.anchor-b.dst.anchor);
  if(!reachable.length){block(s,options.length?'NO_ROUTE':'NO_CAPACITY');continue;}
  for(const {dst,way} of reachable){if(sent>=3||rem<=EPS)break;
   // G2/G2A food is processed before this H4C post-day pulse; same endpoint
   // capacity is shared instead of granting a second full food+stone shipment.
   const food=NS.V034G2A?.routes?.(w)||[];
   let spent=0;for(let i=food.length-1;i>=0;i--){const f=food[i];if(n(f.day)!==day)continue;if(same(f.nation,v.name)&&n(f.fromTileId)===way.from&&n(f.toTileId)===way.to)spent+=n(f.qty);}
   const remaining=Math.max(0,way.capacity-spent);if(remaining<=EPS){block(s,'CARRIER_RESERVED_FOR_FOOD');continue;}
   const moved=move(v,w,src,dst,way,Math.min(rem,remaining));if(moved<=EPS)continue;
   sent++;rem-=moved;s.shipments++;s.quantity+=moved;
   v.logisticsStats=v.logisticsStats||{};v.logisticsStats.moves=n(v.logisticsStats.moves)+1;v.logisticsStats.stoneMoved=n(v.logisticsStats.stoneMoved)+moved;
   const record={day,simTime:w.timestamp?.()||'',nationId:v.id,nation:v.name,fromSettlementId:src.id,toSettlementId:dst.id,fromTileId:way.from,toTileId:way.to,routeCost:+way.cost.toFixed(3),qty:+moved.toFixed(5),excessAfter:+Math.max(0,rem).toFixed(5)};
   s.latest.push(record);if(s.latest.length>70)s.latest.shift();
   w.telemetry?.record?.('STORAGE_OVERFLOW_TRANSFER34H4C',w,record);
  }
 }
 }
 return s;
}
const prevAdvance=NS.World.prototype.advanceOneDay;
NS.World.prototype.advanceOneDay=function(...args){const out=prevAdvance.apply(this,args);redistribute(this);return out;};
function summary(w){const s=stats(w),overflow=NS.V034H4?.storageDiagnosis?.(w)||[];return {version:VERSION,shipments:s.shipments,quantity:+s.quantity.toFixed(5),blockedDeposits:s.blockedDeposits,blockedQuantity:+s.blockedQuantity.toFixed(5),physicalMismatch:s.physicalMismatch,failedReturns:s.failedReturns,blocked:s.blocked,latest:s.latest.slice(-20),pending:overflow.length,pendingQuantity:+overflow.reduce((x,r)=>x+n(r.excess),0).toFixed(5)};}
function strokeNeutralBorders(ui){if((ui.h1BoundaryMode||'all')!=='all')return;const w=ui.world,g=ui._mapGeom,canvas=ui.q?.('worldCanvas');if(!w||!g||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx||!g.cell)return;
 const {cell,ox,oy}=g;ctx.save();ctx.beginPath();ctx.rect(ox,oy,w.map.width*cell,w.map.height*cell);ctx.clip();ctx.beginPath();let count=0;
 for(const t of w.map.tiles){if(t.ownerId==null)continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const other=w.map.at(t.x+dx,t.y+dy);if(!other||other.ownerId!=null)continue;
 const x=ox+(t.x+(dx===1?1:0))*cell,y=oy+(t.y+(dy===1?1:0))*cell;
 ctx.moveTo(x,y);ctx.lineTo(x+(dy!==0?cell:0),y+(dx!==0?cell:0));count++;}}
 if(count){ctx.strokeStyle='#000000';ctx.lineWidth=Math.max(2.3,cell*.115)*.70;ctx.lineJoin='round';ctx.lineCap='square';ctx.globalAlpha=1;ctx.stroke();}ctx.restore();}
const proto=NS.UI?.prototype;
if(proto){const prevMap=proto.renderMap,prevHeader=proto.renderHeader;proto.renderMap=function(...a){const out=prevMap.apply(this,a);strokeNeutralBorders(this);return out;};proto.renderHeader=function(...a){const out=prevHeader.apply(this,a);refresh();return out;};}
function ensureStorageExport(ui){
 if(typeof document==='undefined'||!ui?.world)return;
 const near=document.getElementById('h4aExportStorage');if(!near||document.getElementById('h4cExportStorage'))return;
 const btn=document.createElement('button');btn.id='h4cExportStorage';btn.type='button';
 btn.textContent='H4C · 초과 석재 운송 진단 JSON';btn.style.marginLeft='8px';
 btn.onclick=()=>NS.SaveSystem.exportH4CStorage(ui.world);near.insertAdjacentElement('afterend',btn);
}
if(proto){const prior=proto.renderWorld;proto.renderWorld=function(...args){const out=prior.apply(this,args);ensureStorageExport(this);return out;};}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=oldSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const j=oldJSON.apply(this,a);j.version=VERSION;if(a[0]&&j.worldSummary)j.worldSummary.v034h4c=summary(a[0]);return j;};
const saveFile=(name,obj)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간이 부족합니다. JSON 파일로 내보내 주세요. '+e.message);}},
 load(){const s=localStorage.getItem(KEY);return s?NS.World.from(JSON.parse(s)):oldSave.load?.();},
 export(w){saveFile(`village-observer-v034H4C-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){saveFile(`village-observer-v034H4C-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 exportH4CStorage(w){saveFile(`vilob-h4c-storage-${w.year}y.json`,{version:VERSION,simTime:w.timestamp?.(),summary:summary(w),physical:NS.V034H4A?.diagnosis?.(w)});}
};
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'석재 초과 재분배·국가 전체 외곽선',summary:'과거의 초과 석재는 보존하되 신규 입고는 Settlement 전체 용량 기준으로 제한하고, 실제 통행 가능한 국가 내 정착지로 초과분을 물리 운송합니다. 중립 육지·수역 접경까지 국가 검은 외곽선을 확장합니다.',sections:[['석재 저장',['이미 존재하는 초과 재고는 삭제하지 않습니다.','일반 석재 입고는 정착지 공동 상한에 따라 차단하고, 3일마다 실제 경로·용량 내에서 최대 3건씩 재분배합니다.','실물 재고의 출발·도착 보존식 검사와 반송 실패 롤백을 시행합니다.']],['지도',['국가-국가 경계뿐 아니라 국가-중립 육지 및 국가-물 접경을 H4B와 같은 검은 두께로 그립니다.','세계 국가 비교 색상 막대와 선택 강조 모드는 변경하지 않습니다.']],['관측',['Devlog v034h4c 항목에 배송량·보존식·차단 건수·잔여 초과량을 표시합니다.']]]});
NS.V034H4C=Object.freeze({version:VERSION,groups,redistribute,summary,strokeNeutralBorders,withReturn,move});
try{refresh();}catch(_e){}
})(window.VSim);

;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('H4_OBSERVATION_STACK',args[0],old,this,args):old.apply(this,args);};})(window.VSim);

;
/* H1B2 bundled source: v035a.js */
/* Village Observer V0.35A — opt-in runtime profiler and reproducible measurement foundation.
 * Does not change simulation rules, PRNG, saves, production, resource flow or scheduling.
 * No high-frequency wrappers are installed unless the operator explicitly starts profiling.
 */
(function(NS){'use strict';
const VERSION='V0.35A',PREV='V0.34H4C',KEY='village-observer-v035a';
const catalog=[
 ['World','advanceOneDay','SIM · 하루 전체',1],
 ['Person','act','Person · 행동',16],
 ['Person','metabolism','Person · 신진대사',16],
 ['Village','dailyTick','국가 · 일일 처리',1],
 ['Village','seasonalTick','국가 · 분기 처리',1],
 ['Village','yearlyTick','국가 · 연간 처리',1],
 ['VillageBrain','seasonalDecision','AI · 분기 판단',1],
 ['Village','processBuildingMaintenance','경제 · 유지보수',1],
 ['Village','maintainSettlements','경제 · 유지관리',1],
 ['Village','progressConstruction','건설 · 공사 진행',8],
 ['Village','withdrawNetwork','물류 · 공동 출고',8],
 ['Village','internalPathCost','물류 · 경로 조회',16],
 ['Village','internalLogisticsCapacity','물류 · 운송 용량',16],
 ['Village','depositAt','자원 · 입고',16],
 ['Village','withdrawAt','자원 · 출고',16],
 ['Village','stockAt','자원 · 재고 조회',32],
 ['Village','population','정착지 · 인구 조회',32],
 ['Village','foodReserveDays','식량 · 비축일',16],
 ['Village','seasonalTick','분기 전체 (참조)',1],
 ['UI','renderMap','UI · 지도 렌더',1],
 ['UI','renderWorld','UI · 세계 패널',1],
 ['UI','renderStats','UI · 통계 패널',1],
 ['UI','renderHeader','UI · 상단 렌더',1]
];
let current=null, last=null;
function timer(){return (typeof performance!=='undefined'&&typeof performance.now==='function')?performance.now():Date.now();}
function values(ms){const a=[...ms].sort((x,y)=>x-y);return {p50:a.length?a[Math.floor((a.length-1)*.5)]:0,p95:a.length?a[Math.floor((a.length-1)*.95)]:0};}
function emptyRow(label,interval){return {label,interval,calls:0,samples:0,sum:0,max:0,latency:[]};}
function start(w,opts={}){
 if(!w||!NS.World||!NS.Person||!NS.Village)throw Error('계측할 세계가 없습니다');
 if(current)stop();
 const divisor=Math.max(1,Math.min(32,Math.floor(Number(opts.sampleDivider)||1)));
 const s={world:w,active:true,startedSimTime:w.timestamp?.()||'',startYear:Number(w.year)||0,startNow:timer(),rows:Object.create(null),annual:Object.create(null),dayLatencies:[],dayCount:0,notes:[],restorations:[],inDay:false,divisor};
 current=s;
 const defs={World:NS.World,Person:NS.Person,Village:NS.Village,VillageBrain:NS.VillageBrain,UI:NS.UI};
 const seen=new Set();
 try{
  for(const [cls,method,label,baseInterval] of catalog){
   const key=cls+'.'+method;if(seen.has(key))continue;seen.add(key);
   const owner=defs[cls]?.prototype,orig=owner?.[method];if(typeof orig!=='function')continue;
   const interval=key==='World.advanceOneDay'||key.startsWith('UI.')?1:Math.max(1,baseInterval*divisor);
   s.rows[key]=emptyRow(label,interval);
   const instrumented=function(...args){
    const applicable=s.active&&(cls==='UI'?this.world===s.world:s.inDay||key==='World.advanceOneDay')&&(cls==='World'?this===s.world:cls!=='UI'||this.world===s.world);
    if(!applicable)return orig.apply(this,args);
    const row=s.rows[key],idx=++row.calls,timed=(idx%interval===0||interval===1),before=timed?timer():0;
    if(key==='World.advanceOneDay')s.inDay=true;
    try{return orig.apply(this,args);}finally{
      if(timed){const elapsed=Math.max(0,timer()-before);row.samples++;row.sum+=elapsed;row.max=Math.max(row.max,elapsed);if(row.latency.length<256)row.latency.push(elapsed);else row.latency[(row.samples-1)%256]=elapsed;
       if(key==='World.advanceOneDay'){
        s.dayCount++;const year=Number(s.world.year)||0,a=s.annual[year]||(s.annual[year]={year,days:0,sum:0,max:0,latencies:[]});a.days++;a.sum+=elapsed;a.max=Math.max(a.max,elapsed);
        if(a.latencies.length<96)a.latencies.push(elapsed);else a.latencies[(a.days-1)%96]=elapsed;
        if(s.dayLatencies.length<512)s.dayLatencies.push(elapsed);else s.dayLatencies[(s.dayCount-1)%512]=elapsed;
       }
      }
      if(key==='World.advanceOneDay')s.inDay=false;
    }
   };
   owner[method]=instrumented;s.restorations.push([owner,method,orig,instrumented]);
  }
 }catch(e){for(const [owner,method,orig,instrumented] of s.restorations.reverse())if(owner[method]===instrumented)owner[method]=orig;current=null;throw e;}
 return report(s);
}
function stop(){if(!current)return last;const s=current;s.active=false;
 for(const [owner,method,orig,instrumented] of s.restorations.reverse())if(owner[method]===instrumented)owner[method]=orig;
 s.restorations.length=0;s.finishedNow=timer();s.finishedSimTime=s.world.timestamp?.()||'';last=report(s);current=null;return last;
}
function report(s=current){if(!s)return last||null;
 const rows=Object.entries(s.rows).map(([id,r])=>{
   const mean=r.samples?r.sum/r.samples:0;
   return {id,category:r.label,samplingEvery:r.interval,calls:r.calls,timedCalls:r.samples,sampledTotalMs:+r.sum.toFixed(4),estimatedInclusiveMs:+(mean*r.calls).toFixed(4),meanSampleMs:+mean.toFixed(6),maxSampleMs:+r.max.toFixed(5),p95SampleMs:+values(r.latency).p95.toFixed(5)};
 }).sort((a,b)=>b.estimatedInclusiveMs-a.estimatedInclusiveMs);
 const total=rows.find(x=>x.id==='World.advanceOneDay')?.sampledTotalMs||0;
 const annual=Object.values(s.annual).sort((a,b)=>a.year-b.year).map(a=>({year:a.year,days:a.days,meanDailyMs:+(a.sum/a.days).toFixed(4),maxDailyMs:+a.max.toFixed(4),p95DailyMs:+values(a.latencies).p95.toFixed(4)}));
 let f0=null;try{if(NS.V034F0?.performanceReport)f0=NS.V034F0.performanceReport(s.world);}catch(_){}
 return {format:'vilob-v035a-profile-v1',version:VERSION,simTime:s.world.timestamp?.()||'',startedSimTime:s.startedSimTime,finishedSimTime:s.finishedSimTime||null,active:!!s.active,observedDays:s.dayCount,sampleDivider:s.divisor,elapsedRealMs:+((s.finishedNow||timer())-s.startNow).toFixed(3),simulationDayTotalMs:total,
  interpretation:{scope:'World.advanceOneDay: sampled complete simulation days; method probes: inclusive wall-clock sampled at deterministic call intervals',overlap:'Nested method inclusive times overlap; NEVER add row totals or treat each category as exclusive.',sampling:'estimatedInclusiveMs = sampled mean × observed calls; low sample counts / expensive uneven calls need longer runs.',instrumentation:'Enable profiler measures additional wrapper and timer overhead; use unprofiled A/B to assess actual speed.',coverage:'Only explicitly named methods are covered. Unmeasured time and internal lexical functions are not assigned to a category.',device:'Node VM and Chromium UI timings are NOT directly comparable to browser ×10 SIM/BATCH or Wall.'},rows,top10:rows.filter(r=>r.id!=='World.advanceOneDay'&&!r.id.startsWith('UI.')).slice(0,10),annual,f0Performance:f0,memoryHint:typeof performance!=='undefined'&&performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize}:null};
}
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDevlog=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=oldSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=oldDevlog.apply(this,a);d.version=VERSION;return d;};
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간이 부족합니다. JSON으로 내보내 주세요. '+e.message);}},
 load(){const str=localStorage.getItem(KEY);return str?NS.World.from(JSON.parse(str)):oldSave.load?.();},
 export(w){download(`village-observer-v035A-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035A-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35AProfile(w){const data=report();if(!data)throw Error('먼저 계측을 시작해 주세요');download(`vilob-v035A-profile-${w.year}y.json`,data);}
};
function panel(ui){if(typeof document==='undefined'||!ui?.world)return;
 let area=document.getElementById('v035aProfilePanel');if(!area){const host=document.getElementById('h3Diagnostics')||document.getElementById('h3Advanced')||document.getElementById('v034f0PerfPanel');if(!host)return;
  area=document.createElement('div');area.id='v035aProfilePanel';area.className='panel';area.style.marginTop='8px';area.innerHTML='<div class="section-head"><h3>35A · 정밀 성능 계측</h3><span class="tag">진단 전용</span></div><div class="small muted">기본 비활성 · 시작 시에만 계측 래퍼 설치 · 종료 시 원상 복구</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"><button type="button" id="v035aStart">계측 시작</button><button type="button" id="v035aStop">계측 종료</button><button type="button" id="v035aExport">계측 JSON</button></div><div id="v035aText" class="small muted">계측 기록 없음</div><div id="v035aTop" class="small muted"></div>';
  host.appendChild(area);area.querySelector('#v035aStart').onclick=()=>{start(ui.world);panel(ui);};area.querySelector('#v035aStop').onclick=()=>{stop();panel(ui);};area.querySelector('#v035aExport').onclick=()=>NS.SaveSystem.export35AProfile(ui.world);
 }
 const r=report(),txt=area.querySelector('#v035aText'),top=area.querySelector('#v035aTop');if(txt)txt.textContent=r?`${r.active?'계측 중':'계측 종료'} · ${r.observedDays}일 · 일일 평균 ${(r.simulationDayTotalMs/Math.max(1,r.observedDays)).toFixed(2)}ms · 측정값에는 계측 오버헤드 포함`:'계측 기록 없음';
 if(top&&r)top.textContent='추정 상위: '+r.top10.slice(0,3).map(x=>`${x.category} ${x.estimatedInclusiveMs.toFixed(0)}ms (${x.calls}회)`).join(' / ');
 if(area.querySelector('#v035aStart'))area.querySelector('#v035aStart').disabled=!!current&&current.world===ui.world;
 if(area.querySelector('#v035aStop'))area.querySelector('#v035aStop').disabled=!current;
}
const P=NS.UI?.prototype;
if(P){const before=P.renderWorld;P.renderWorld=function(...a){const out=before.apply(this,a);panel(this);return out;};}
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
if(P){const oldHeader=P.renderHeader;P.renderHeader=function(...a){const out=oldHeader.apply(this,a);refresh();return out;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'Performance Baseline & Profiler V2',summary:'V0.34H4C의 게임 규칙을 유지하고, 사용자 선택 계측과 함수 호출량·비용·연도별 증가 분석을 도입합니다.',sections:[['실측 기반',['계측 시작 후 Person·Settlement·물류·AI·시즌·렌더 핵심 함수의 호출량과 샘플 시간을 JSON으로 추출합니다.','중첩 함수의 시간은 inclusive이므로 합산하지 않습니다. 프로파일러 자체 오버헤드를 감안해 비계측 A/B 검증을 별도로 수행합니다.']],['안전성',['기본 비활성. 계측 종료 시 메서드를 원본으로 되돌리며 세이브에 진단 상태를 저장하지 않습니다.','생산·물류·Person·AI·전투·RNG·Gold·기술·CSV 스키마를 변경하지 않습니다.']],['기준선',['같은 저장 파일을 사용하는 H4C↔35A 실행 비교 도구를 제공하고 실제 90년 원본 세이브는 사용자 기기에서만 선택할 수 있습니다.']]]});
NS.V035A=Object.freeze({version:VERSION,start,stop,report:()=>report(),isActive:()=>!!current,probeCatalog:catalog.map(x=>[...x])});
try{refresh();}catch(_e){}
})(window.VSim);

;
/* H1B2 bundled source: v035b.js */
/* Village Observer V0.35B — Administrative Logistics Hotpath Optimization.
 * The single admin-model lookup is applied in tools/35b-transform.mjs to D2's
 * lexical sameInstitutionD2 helper. All gameplay constants/route rules remain H35A.
 * Optional diagnostic instrumentation is OFF by default and never enters Save JSON.
 */
(function(NS){'use strict';
const VERSION='V0.35B',PREV='V0.35A',KEY='village-observer-v035b';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDevlog=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=oldSerialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=oldDevlog.apply(this,a);d.version=VERSION;return d;};
let diagnostic=null,diagnosticLast=null;
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
function begin(){if(diagnostic)return result();const orig=NS.V032D?.adminModel;if(typeof orig!=='function')throw new Error('Administrative model not available');
 const scope={orig,calls:0,force:0,measured:0,sum:0,max:0,started:clock()};
 const wrapped=function(...args){scope.calls++;if(args[2])scope.force++;const measure=scope.calls%16===0;if(!measure)return orig.apply(this,args);const t=clock();try{return orig.apply(this,args);}finally{const ms=clock()-t;scope.measured++;scope.sum+=ms;scope.max=Math.max(scope.max,ms);}};
 scope.wrapped=wrapped;NS.V032D.adminModel=wrapped;diagnostic=scope;return result();}
function end(){if(diagnostic){const s=diagnostic;if(NS.V032D.adminModel===s.wrapped)NS.V032D.adminModel=s.orig;diagnosticLast={...result(),active:false};diagnostic=null;}return diagnosticLast;}
function result(){const s=diagnostic;if(!s)return diagnosticLast||null;return {version:VERSION,active:true,adminModelCalls:s.calls,forcedCalls:s.force,sampledCalls:s.measured,meanSampleMs:s.measured?s.sum/s.measured:0,estimatedInclusiveMs:s.measured?s.sum/s.measured*s.calls:0,maxSampleMs:s.max,elapsedMs:clock()-s.started,note:'Opt-in; inclusive sampled time overlaps other probes; no simulation RNG consumed.'};}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간이 부족합니다. JSON으로 내보내 주세요. '+e.message);}},
 load(){const str=localStorage.getItem(KEY);return str?NS.World.from(JSON.parse(str)):oldSave.load?.();},
 export(w){download(`village-observer-v035B-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035B-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35AProfile(w){const d=NS.V035A?.report();if(!d)throw Error('먼저 계측을 시작해 주세요');download(`vilob-v035B-profile-${w.year}y.json`,{...d,version:VERSION,v035bAdminDetail:result()});}
};
const P=NS.UI?.prototype;
if(P){const oldWorld=P.renderWorld;P.renderWorld=function(...args){const out=oldWorld.apply(this,args);if(typeof document==='undefined')return out;
  const parent=document.getElementById('v035aProfilePanel');if(!parent)return out;
  let panel=document.getElementById('v035bAdminPanel');if(!panel){panel=document.createElement('div');panel.id='v035bAdminPanel';panel.className='small muted';panel.innerHTML='<div style="margin:6px 0">35B · 행정 모델 호출 상세계측 (선택)</div><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" id="v035bBegin">행정 계측 시작</button><button type="button" id="v035bEnd">행정 계측 종료</button></div><div id="v035bAdminStats"></div>';parent.appendChild(panel);panel.querySelector('#v035bBegin').onclick=()=>{begin();};panel.querySelector('#v035bEnd').onclick=()=>{end();};}
  const s=result();const stats=panel.querySelector('#v035bAdminStats');if(stats)stats.textContent=s?`호출 ${s.adminModelCalls}회 · 추정 ${s.estimatedInclusiveMs?.toFixed(1)||0}ms · ${s.active?'계측 중':'종료'}`:'계측 기록 없음';return out;};}
function refresh(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
if(P){const oldHead=P.renderHeader;P.renderHeader=function(...a){const r=oldHead.apply(this,a);refresh();return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'Administrative Logistics Hotpath Optimization',summary:'내부 물류의 동일 호출 안에서 행정 모델 중복 평가를 제거합니다. 규칙과 캐시 수명은 유지합니다.',sections:[['성능',['sameInstitutionD2의 출발·도착지 행정 모델 호출을 한 번으로 통합합니다.','행정 모델 부수효과를 고려해 하루 단위 전역 캐시는 도입하지 않습니다.']],['검증',['행정 모델의 별도 선택 계측을 지원합니다.','물류·행정권·자원·Gold·RNG·AI·전쟁 규칙과 기존 35A 성능 계측은 유지합니다.']]]});
NS.V035B=Object.freeze({version:VERSION,startDetail:begin,stopDetail:end,reportDetail:result});
try{refresh();}catch(_){}
})(window.VSim);

;
/* H1B2 bundled source: v035c.js */
/* Village Observer V0.35C — Seasonal & Administrative Hotpath Diagnostics.
 * Explicitly opt-in.  Preserve the side effects of adminModel on every call.
 * 35C does not introduce long-lived administration caches or gameplay changes.
 */
(function(NS){'use strict';
const VERSION='V0.35C',PREV='V0.35B',KEY='village-observer-v035c';
const prevSerialize=NS.World.prototype.serialize,prevFrom=NS.World.from,prevDevlog=NS.Telemetry.prototype.toJSON,priorSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const o=prevSerialize.apply(this,args);o.version=VERSION;return o;};
NS.World.from=function(o,...args){return prevFrom.call(this,o?.version===VERSION?{...o,version:PREV}:o,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const o=prevDevlog.apply(this,args);o.version=VERSION;return o;};
const now=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
let session=null,latest=null;
const groups=['logistics','seasonal','daily','other'];
const fresh=()=>({calls:0,samples:0,sampleMs:0,maxMs:0,forced:0});
function snapshot(s){
 if(!s)return latest;
 const admin={};for(const k of groups){const x=s.admin[k];admin[k]={...x,meanSampleMs:x.samples?+(x.sampleMs/x.samples).toFixed(5):0,estimatedInclusiveMs:x.samples?+(x.sampleMs/x.samples*x.calls).toFixed(3):0};}
 const labels=NS.V034C1B?.LABELS||{};
 const stages=Object.entries(s.stages).map(([id,x])=>({id,label:labels[id]||id,totalMs:+x.toFixed(3),quarters:s.quarters.length})).sort((a,b)=>b.totalMs-a.totalMs);
 return {format:'vilob-v035c-season-admin-v1',version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime||null,observedDays:s.days,quarterCount:s.quarters.length,adminModel:{totalCalls:groups.reduce((v,k)=>v+s.admin[k].calls,0),groups:admin,classification:'Only public NS.V032D.adminModel invocations are counted (lexical adminModel32D calls inside old scripts are not wrapped); nested methods attributed to innermost tagged scope; inclusive samples not additive to other scopes'},seasonal:{quarters:s.quarters.map(q=>({...q})),stages,legacyProfilerNote:'C1B checkpoint increments are disjoint WITHIN each quarter; never add E9/E10 overlapping timers or administration inclusive time.'},f0Metric:'F0 SIM/BATCH (10x) remains separate from timed method samples',statusNote:'Administration model full state-update path remains active; no global or day cache.'};
}
function start(w){
 if(!w)throw Error('세계가 없습니다');if(session)stop();if(NS.V035A?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('35A/35B 계측을 먼저 종료한 다음 35C를 시작해 주세요.');
 const p=NS.V034C1B,ad=NS.V032D;if(typeof p?.setEnabled!=='function'||typeof ad?.adminModel!=='function')throw Error('35C profiler prerequisite unavailable');
 const s={world:w,active:true,startTime:w.timestamp?.()||'',startNow:now(),days:0,lastCal:null,quarters:[],stages:{},admin:Object.fromEntries(groups.map(k=>[k,fresh()])),restores:[],stack:[]};
 s.wasEnabled=!!p.summarize(w)?.enabled;p.setEnabled(w,true);
 const install=(owner,key,callback)=>{const original=owner?.[key];if(typeof original!=='function')throw Error('35C cannot instrument '+key);const wrapper=function(...args){return callback.call(this,original,args);};owner[key]=wrapper;s.restores.push([owner,key,original,wrapper]);};
 function tag(group,orig,args,ctx){s.stack.push(group);try{return orig.apply(ctx,args);}finally{s.stack.pop();}}
 function capture(){const v=p.summarize(w);if(!v?.hasProfile||!v.sampleCount||s.lastCal===v.calendarDay)return;s.lastCal=v.calendarDay;const q={year:v.year,season:v.season,calendarDay:v.calendarDay,outerMs:v.outerMs,sampleCount:v.sampleCount,missing:v.missingCheckpoints,stages:{...v.stages}};s.quarters.push(q);for(const [key,value] of Object.entries(v.stages||{}))s.stages[key]=(s.stages[key]||0)+Number(value||0);}
 try{
  install(NS.Village.prototype,'internalLogisticsCapacity',function(orig,args){if(this._world!==w)return orig.apply(this,args);return tag('logistics',orig,args,this);});
  install(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);return tag('seasonal',orig,args,this);});
  install(NS.Village.prototype,'dailyTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);return tag('daily',orig,args,this);});
  install(ad,'adminModel',function(orig,args){if(args[1]!==w)return orig.apply(this,args);const group=s.stack.at(-1)||'other',stat=s.admin[group],n=++stat.calls;if(args[2])stat.forced++;if(n%16!==0)return orig.apply(this,args);const tick=now();try{return orig.apply(this,args);}finally{const time=Math.max(0,now()-tick);stat.samples++;stat.sampleMs+=time;stat.maxMs=Math.max(stat.maxMs,time);}});
  install(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});
 }catch(err){for(const [obj,k,old,f] of s.restores.reverse())if(obj[k]===f)obj[k]=old;if(!s.wasEnabled)p.setEnabled(w,false);throw err;}
 session=s;return snapshot(s);
}
function stop(){if(!session)return latest;const s=session;s.active=false;
 for(const [obj,k,old,fn] of s.restores.reverse())if(obj[k]===fn)obj[k]=old;
 if(!s.wasEnabled)NS.V034C1B.setEnabled(s.world,false);
 s.finishTime=s.world.timestamp?.()||'';latest=snapshot(s);session=null;return latest;
}
function report(){return session?snapshot(session):latest;}
function download(name,obj){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(err){throw Error('저장 공간 부족: JSON으로 내보내 주세요. '+err.message);}},
 load(){const x=localStorage.getItem(KEY);return x?NS.World.from(JSON.parse(x)):priorSave.load?.();},
 export(w){download(`village-observer-v035C-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035C-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35AProfile(w){const p=NS.V035A?.report();if(!p&&!report())throw Error('먼저 계측을 시작해 주세요');download(`vilob-v035C-profile-${w.year}y.json`,{...(p||{}),version:VERSION,v035bAdminDetail:NS.V035B?.reportDetail?.()||null,v035cDetail:report()});},
 export35CProfile(w){const x=report();if(!x)throw Error('먼저 35C 계측을 실행해 주세요');download(`vilob-v035C-season-admin-${w.year}y.json`,{...x,v035aProfile:NS.V035A?.report()||null,v035bAdminDetail:NS.V035B?.reportDetail?.()||null});}
};
const UI=NS.UI?.prototype;
if(UI){const before=UI.renderWorld;UI.renderWorld=function(...args){const out=before.apply(this,args);if(typeof document==='undefined')return out;const parent=document.getElementById('v035bAdminPanel')||document.getElementById('v035aProfilePanel');if(!parent)return out;
 let box=document.getElementById('v035cPanel');if(!box){box=document.createElement('div');box.id='v035cPanel';box.className='small muted';box.style.marginTop='8px';box.innerHTML='<strong>35C · 분기·행정 정밀 추적 (선택)</strong><div class="small muted">분기별 과거 래퍼 비용 및 호출 영역. 기본 OFF, 계측에는 별도 부담이 있습니다.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button type="button" id="v035cStart">35C 계측 시작</button><button type="button" id="v035cStop">35C 계측 종료</button><button type="button" id="v035cExport">35C JSON 저장</button></div><div id="v035cStats"></div>';parent.appendChild(box);box.querySelector('#v035cStart').onclick=()=>{try{start(this.world);}catch(e){const area=box.querySelector('#v035cStats');if(area)area.textContent=String(e?.message||e);}};box.querySelector('#v035cStop').onclick=()=>stop();box.querySelector('#v035cExport').onclick=()=>NS.SaveSystem.export35CProfile(this.world);}
 const r=report(),stats=box.querySelector('#v035cStats');if(stats)stats.textContent=r?`관측 ${r.observedDays}일 · 분기 ${r.quarterCount}회 · 행정 ${r.adminModel.totalCalls}회 · ${r.active?'계측 중':'종료'}`:'계측 기록 없음';return out;};
 const hdr=UI.renderHeader;UI.renderHeader=function(...a){const r=hdr.apply(this,a);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}return r;};
}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-20',title:'Seasonal & Administrative Hotpath V2',summary:'관리 상태의 시점·이벤트를 유지하고 최신 행정권 결과의 타일 인덱스를 활용하며, 분기별 레거시 처리 비용을 정밀 분석할 수 있습니다.',sections:[['행정',['동일 모델 결과의 byTile 인덱스를 이용해 물류 행정권 소속 조회를 가속합니다.','행정 상태 갱신과 이벤트 발생을 생략하는 장기 캐시는 도입하지 않았습니다.']],['성능 관측',['35C 정밀 추적으로 분기별 C1B 레거시 계층 비용을 누적 보고합니다.','행정 모델 호출을 물류·분기·일일·기타 영역으로 구분합니다.']],['유지',['기존 기술 43개, CSV 1683열, 원본 레거시 169블록, H4C 물류 및 국가 경계 표시를 유지합니다.']]]});
NS.V035C=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!session});
})(window.VSim);

;
/* H1B2 bundled source: v035d.js */
/* Village Observer V0.35D — Society18 Hotpath V1.
 * Legacy instrumentation is opt-in; production ledger and demand-trade scans
 * are local deterministic transforms, with no persistent cache or new RNG.
 */
(function(NS){'use strict';
const VERSION='V0.35D',PREV='V0.35C',KEY='village-observer-v035d';
const originalSerialize=NS.World.prototype.serialize,originalFrom=NS.World.from,originalDevlog=NS.Telemetry.prototype.toJSON,priorSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const v=originalSerialize.apply(this,a);v.version=VERSION;return v;};
NS.World.from=function(d,...a){return originalFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=originalDevlog.apply(this,a);d.version=VERSION;return d;};
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const metricIds=['demandDevelopment','settlementPressure','tradeVolumeLookup','localTargetPrice','recoveryProfile','updateRecovery','foodSpoilage','concernEvents','festivalDecision'];
let current=null,previous=null;
function zero(){return{calls:0,inclusiveMs:0,exclusiveMs:0,maxMs:0,p95:[],exceptions:0};}
function view(s){if(!s)return previous;const out={};for(const k of metricIds){const x=s.metrics[k],sorted=x.p95.slice().sort((a,b)=>a-b);out[k]={calls:x.calls,inclusiveMs:+x.inclusiveMs.toFixed(3),exclusiveMs:+x.exclusiveMs.toFixed(3),meanMs:x.calls?+(x.inclusiveMs/x.calls).toFixed(5):0,maxMs:+x.maxMs.toFixed(3),p95Ms:sorted.length?+sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*.95)-1)].toFixed(3):0,exceptions:x.exceptions};}
 return {format:'vilob-v035d-society-v1',version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime||null,observedDays:s.days,quarterCount:s.quarters.length,metrics:out,seasonal:s.quarters.map(q=>({...q})),notes:['Only calls inside Village.seasonalTick are timed. Per-metric inclusive values overlap with parents; exclusive time excludes measured children only.','The 35C 21-layer checkpoint is independent from these nested timers.','Sampling is opt-in and may distort performance. Use an unprofiled same-save A/B to claim speedups.','The source transformation preserves legacy original blocks and does not use daily/global cache.']};
}
function isMeasuring(){return!!current&&current.seasonDepth>0;}
function measure(id,fn){const s=current;if(!s||s.seasonDepth===0||!s.metrics[id])return fn();const x=s.metrics[id],t=clock(),f={child:0};s.frames.push(f);let failed=false;try{return fn();}catch(err){failed=true;throw err;}finally{const ms=Math.max(0,clock()-t);s.frames.pop();x.calls++;x.inclusiveMs+=ms;x.exclusiveMs+=Math.max(0,ms-f.child);x.maxMs=Math.max(x.maxMs,ms);if(failed)x.exceptions++;if(x.p95.length<10000)x.p95.push(ms);if(s.frames.length)s.frames[s.frames.length-1].child+=ms;}}
function start(w){if(!w)throw Error('세계가 없습니다');if(current)stop();if(NS.V035A?.isActive?.()||NS.V035C?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('35A/35B/35C 계측을 먼저 종료해 주세요.');const p=NS.V034C1B;if(!p?.setEnabled)throw Error('분기 계층 계측기가 없습니다.');
 const s={w,active:true,startTime:w.timestamp?.()||'',finishTime:null,days:0,seasonDepth:0,frames:[],quarters:[],lastCal:null,metrics:Object.fromEntries(metricIds.map(k=>[k,zero()])),restore:[],wasEnabled:!!p.summarize(w)?.enabled};
 p.setEnabled(w,true);function wrap(owner,key,hook){const fn=owner[key];if(typeof fn!=='function')throw Error('35D missing '+key);const replacement=function(...a){return hook.call(this,fn,a);};owner[key]=replacement;s.restore.push([owner,key,fn,replacement]);}
 function capture(){const v=p.summarize(w);if(!v?.hasProfile||!v.sampleCount||s.lastCal===v.calendarDay)return;s.lastCal=v.calendarDay;s.quarters.push({year:v.year,season:v.season,calendarDay:v.calendarDay,outerMs:v.outerMs,stages:{...v.stages},missing:v.missingCheckpoints});}
 try{wrap(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);s.seasonDepth++;try{return orig.apply(this,args);}finally{s.seasonDepth--;}});
 wrap(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});}
 catch(e){for(const [o,k,f,r] of s.restore.reverse())if(o[k]===r)o[k]=f;if(!s.wasEnabled)p.setEnabled(w,false);throw e;}
 current=s;return view(s);
}
function stop(){if(!current)return previous;const s=current;s.active=false;for(const [o,k,fn,wrapper] of s.restore.reverse())if(o[k]===wrapper)o[k]=fn;if(!s.wasEnabled)NS.V034C1B.setEnabled(s.w,false);s.finishTime=s.w.timestamp?.()||'';previous=view(s);current=null;return previous;}
function report(){return current?view(current):previous;}
function download(name,obj){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(err){throw Error('저장 공간 부족: JSON으로 내보내 주세요. '+err.message);}},
 load(){const text=localStorage.getItem(KEY);return text?NS.World.from(JSON.parse(text)):priorSave.load?.();},
 export(w){download(`village-observer-v035D-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035D-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35DProfile(w){const d=report();if(!d)throw Error('먼저 35D 계측을 실행해 주세요');download(`vilob-v035D-society-${w.year}y.json`,d);}
};
const UI=NS.UI?.prototype;if(UI){const original=UI.renderWorld;UI.renderWorld=function(...a){const r=original.apply(this,a);if(typeof document==='undefined')return r;const parent=document.getElementById('v035cPanel')||document.getElementById('v035bAdminPanel');if(!parent)return r;let el=document.getElementById('v035dPanel');if(!el){el=document.createElement('div');el.id='v035dPanel';el.className='small muted';el.style.marginTop='8px';el.innerHTML='<strong>35D · 사회·경제 분기 상세 계측 (선택)</strong><div class="small muted">society18 내부 함수 시간 및 21계층 비교. 기본 OFF, 계측 중 시간 오버헤드 발생.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button id="v035dStart" type="button">35D 계측 시작</button><button id="v035dStop" type="button">35D 계측 종료</button><button id="v035dExport" type="button">35D JSON 저장</button></div><div id="v035dStatus"></div>';parent.appendChild(el);el.querySelector('#v035dStart').onclick=()=>{try{start(this.world);}catch(e){el.querySelector('#v035dStatus').textContent=String(e?.message||e);}};el.querySelector('#v035dStop').onclick=()=>stop();el.querySelector('#v035dExport').onclick=()=>NS.SaveSystem.export35DProfile(this.world);}const p=report();const st=el.querySelector('#v035dStatus');if(st)st.textContent=p?`관측 ${p.observedDays}일 · 분기 ${p.quarterCount}회 · ${p.active?'계측 중':'종료'}`:'계측 기록 없음';return r;};
 const hdr=UI.renderHeader;UI.renderHeader=function(...a){const r=hdr.apply(this,a);if(typeof document!=='undefined'){document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-21',title:'Society18 Hotpath Optimization',summary:'초기 사회·경제 분기 처리에서 반복되는 최근 거래·생산 이력 검색을 국소 최적화하고 함수별 선택 계측을 추가합니다.',sections:[['사회·경제 성능',['정착지 개발 수요 평가에서 최근 거래를 한 번의 순회로 정착지별 집계합니다.','시장 생산 이력의 30일·120일 반복 탐색을 하나의 순회로 통합합니다.']],['정밀 계측',['35D 사회·경제 상세 계측을 추가합니다.','분기 사회 계층 내 대상 함수별 호출·평균·P95·배타적/포괄 시간 비교를 내보냅니다.']],['안정성',['세계 상태·RNG·경제·행정·외교 규칙의 동일성을 유지합니다.','43기술·1683열 CSV·169개 보호 블록을 그대로 유지합니다.']]]});
NS.V035D=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!current,isMeasuring,measure});
// 35B initializes its version badge at bootstrap, while later releases only
// refresh it on UI.renderHeader(). Initial load must show the actual release
// even before the user starts the simulation or triggers another render.
if(typeof document!=='undefined'){
 document.title='Village Observer '+VERSION;
 const badge=document.getElementById('versionBadge');
 if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}
}
})(window.VSim);

;
/* H1B2 bundled source: v035e.js */
/* Village Observer V0.35E — Housing Hotpath V1.
 * Production optimizations are build transforms; only opt-in profiling gathers
 * call-path timing, counters and end-state hints. No gameplay skips or day cache.
 */
(function(NS){'use strict';
const VERSION='V0.35E',PREV='V0.35D',KEY='village-observer-v035e';
const oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldDevlog=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const out=oldSerialize.apply(this,args);out.version=VERSION;return out;};
NS.World.from=function(d,...args){return oldFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const out=oldDevlog.apply(this,args);out.version=VERSION;return out;};
const now=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const metrics=['demandDevelopment','buildHouseTop','buildHouseV17','housingRowsD3','tryHousingResolveD3','orderedHousingScopeD3','adminRegionKeyD3','tileBusyD3'];
let current=null,previous=null;
function empty(){return {calls:0,success:0,failure:0,exceptions:0,inclusiveMs:0,exclusiveMs:0,maxMs:0,samples:[]};}
function measure(name,cb){const s=current;if(!s||s.seasonDepth<1||!s.metrics[name])return cb();const a=s.metrics[name],begin=now(),frame={child:0};s.frames.push(frame);let failed=false,returned=false,result;try{result=cb();returned=true;return result;}catch(e){failed=true;throw e;}finally{const ms=Math.max(0,now()-begin);s.frames.pop();a.calls++;a.inclusiveMs+=ms;a.exclusiveMs+=Math.max(0,ms-frame.child);a.maxMs=Math.max(a.maxMs,ms);if(failed)a.exceptions++;if(returned){if(result)a.success++;else a.failure++;}if(a.samples.length<10000)a.samples.push(ms);if(s.frames.length)s.frames[s.frames.length-1].child+=ms;}}
function housingEffectsState(v,w){return{
 telemetry:Number(w?.telemetry?.entries?.length||0),
 reserveBlocks:Number(v?.v32d3Housing?.reserveBlocks||0),
 housingActions:Number(v?.v32d3Housing?.actions||0),
 relocations:Number(v?.v32d3Housing?.relocations||0),
 construction:Number(v?.constructionProjects?.length||0),
 land:Number(v?.landDevelopmentProjects?.length||0),
 upgrade:Number(v?.buildingUpgradeProjects?.length||0)
};}
function measureHouseCall(v,w,fn){const s=current;if(!s||s.seasonDepth===0)return fn();const before=housingEffectsState(v,w);let returned=false,value;
 try{value=measure('buildHouseTop',fn);returned=true;return value;}
 finally{const e=s.houseEffects,after=housingEffectsState(v,w);if(returned){if(value)e.success++;else e.failure++;}else e.exceptions++;
 if(returned&&!value){if(after.telemetry!==before.telemetry)e.failedWithTelemetry++;
  if(after.reserveBlocks!==before.reserveBlocks||after.housingActions!==before.housingActions||after.relocations!==before.relocations)e.failedWithHousingState++;
  if(after.construction!==before.construction||after.land!==before.land||after.upgrade!==before.upgrade)e.failedWithProjectCount++;}
 }}
function isMeasuring(){return !!current&&current.seasonDepth>0;}
function view(s){if(!s)return previous;const out={};for(const id of metrics){const v=s.metrics[id],sort=v.samples.slice().sort((a,b)=>a-b);out[id]={calls:v.calls,success:v.success,failure:v.failure,exceptions:v.exceptions,inclusiveMs:+v.inclusiveMs.toFixed(2),exclusiveMs:+v.exclusiveMs.toFixed(2),meanMs:v.calls?+(v.inclusiveMs/v.calls).toFixed(4):0,maxMs:+v.maxMs.toFixed(2),p95Ms:sort.length?+sort[Math.ceil(sort.length*.95)-1].toFixed(2):0};}return{format:'vilob-v035e-housing-v1',houseEffects:{...s.houseEffects},version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime,observedDays:s.days,quarterCount:s.quarters.length,metrics:out,seasonal:s.quarters,notes:['Only calls within seasonalTick are measured; inclusive timings of nested functions overlap.','Success/failure classify truthiness of returned values; only buildHouse and tryHousingResolveD3 are meaningful as action outcomes.','No production buildHouse attempts or events are skipped.','The 21-layer seasonal profiler is enabled during this opt-in session; do not claim unprofiled speedup from this report.']};}
function start(w){if(!w)throw Error('세계가 없습니다');if(current)stop();if(NS.V035D?.isActive?.()||NS.V035C?.isActive?.()||NS.V035A?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('35A~35D 계측을 먼저 종료해 주세요.');const p=NS.V034C1B;if(!p?.setEnabled)throw Error('분기 계층 계측기가 없습니다.');
 const s={w,active:true,startTime:w.timestamp?.()||'',finishTime:null,days:0,seasonDepth:0,frames:[],quarters:[],lastCal:null,metrics:Object.fromEntries(metrics.map(k=>[k,empty()])),houseEffects:{success:0,failure:0,exceptions:0,failedWithTelemetry:0,failedWithHousingState:0,failedWithProjectCount:0},restore:[],wasEnabled:!!p.summarize(w)?.enabled};
 p.setEnabled(w,true);
 function wrap(obj,key,handler){const orig=obj[key];if(typeof orig!=='function')throw Error('35E missing '+key);const wrapped=function(...args){return handler.call(this,orig,args);};obj[key]=wrapped;s.restore.push([obj,key,orig,wrapped]);}
 function capture(){const q=p.summarize(w);if(q?.hasProfile&&q.sampleCount&&s.lastCal!==q.calendarDay){s.lastCal=q.calendarDay;s.quarters.push({year:q.year,season:q.season,calendarDay:q.calendarDay,outerMs:q.outerMs,stages:{...q.stages},missing:q.missingCheckpoints});}}
 try{wrap(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);s.seasonDepth++;try{return orig.apply(this,args);}finally{s.seasonDepth--;}});
 wrap(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});}
 catch(e){for(const [obj,key,orig,wrapped] of s.restore.reverse())if(obj[key]===wrapped)obj[key]=orig;if(!s.wasEnabled)p.setEnabled(w,false);throw e;}
 current=s;return view(s);
}
function stop(){if(!current)return previous;const s=current;s.active=false;for(const [obj,key,orig,wrapped] of s.restore.reverse())if(obj[key]===wrapped)obj[key]=orig;if(!s.wasEnabled)NS.V034C1B.setEnabled(s.w,false);s.finishTime=s.w.timestamp?.()||'';previous=view(s);current=null;return previous;}
function report(){return current?view(current):previous;}
function download(name,data){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
NS.SaveSystem={...oldSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족: JSON으로 내보내 주세요. '+e.message);}},
 load(){const data=localStorage.getItem(KEY);return data?NS.World.from(JSON.parse(data)):oldSave.load?.();},
 export(w){download(`village-observer-v035E-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035E-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35EProfile(w){const r=report();if(!r)throw Error('35E 계측을 먼저 실행해 주세요');download(`vilob-v035E-housing-${w.year}y.json`,r);}
};
const UI=NS.UI?.prototype;if(UI){const prevWorld=UI.renderWorld;UI.renderWorld=function(...args){const out=prevWorld.apply(this,args);if(typeof document==='undefined')return out;const parent=document.getElementById('v035dPanel')||document.getElementById('v035cPanel');if(!parent)return out;let el=document.getElementById('v035ePanel');if(!el){el=document.createElement('div');el.id='v035ePanel';el.className='small muted';el.style.marginTop='8px';el.innerHTML='<strong>35E · 주거·건설 분기 상세 계측 (선택)</strong><div class="small muted">D3 주거 해결과 V0.17 주택 건설, 후보 목록 및 주거 범위 연산을 측정. 기본 OFF.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button id="v035eStart" type="button">35E 계측 시작</button><button id="v035eStop" type="button">35E 계측 종료</button><button id="v035eExport" type="button">35E JSON 저장</button></div><div id="v035eStatus"></div>';parent.appendChild(el);el.querySelector('#v035eStart').onclick=()=>{try{start(this.world);}catch(e){el.querySelector('#v035eStatus').textContent=String(e?.message||e);}};el.querySelector('#v035eStop').onclick=()=>stop();el.querySelector('#v035eExport').onclick=()=>NS.SaveSystem.export35EProfile(this.world);}const r=report(),label=el.querySelector('#v035eStatus');if(label)label.textContent=r?`관측 ${r.observedDays}일 · 분기 ${r.quarterCount}회 · ${r.active?'계측 중':'종료'}`:'계측 기록 없음';return out;};
 const prevHdr=UI.renderHeader;UI.renderHeader=function(...args){const out=prevHdr.apply(this,args);syncVersion();return out;};}
function syncVersion(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(p=>p.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-21',title:'Housing Demand Hotpath',summary:'주거 개발 수요의 중복 주민 조회와 D3 후보 거리 재계산을 제거하고 선택형 건설 계측을 추가합니다. 최초 화면 버전 표기를 수정합니다.',sections:[['주거 성능',['V0.17 건설 후보의 미사용 주민 수 집계를 제거합니다.','D3 주거 후보 순서 계산에서 같은 거리의 중복 조회를 제거합니다.','주택 건설 시도·실패·이벤트·RNG 순서는 바꾸지 않습니다.']],['진단',['V0.35E 주거·건설 분기 계측 기능을 제공합니다.','D3 후보, 범위, 건설 판단 및 이전 버전 건설 로직을 분리해서 측정합니다.']],['표시 및 안정성',['최초 화면 좌상단 버전 표시를 최신 릴리스로 갱신합니다.','43기술·CSV 1683열·보호 레거시 169블록은 그대로 유지합니다.']]]});
NS.V035E=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!current,isMeasuring,measure,measureHouseCall});
syncVersion();
})(window.VSim);

;
/* H1B2 bundled source: v035f.js */
/* Village Observer V0.35F — Development & Construction diagnostics.
   All measurements are opt-in. Production paths and RNG remain untouched. */
(function(NS){'use strict';
const VERSION='V0.35F',PREV='V0.35E',KEY='village-observer-v035f';
const from=NS.World.from,serialize=NS.World.prototype.serialize,devlog=NS.Telemetry.prototype.toJSON,save=NS.SaveSystem;
NS.World.prototype.serialize=function(...a){const d=serialize.apply(this,a);d.version=VERSION;return d;};
NS.World.from=function(d,...a){return from.call(this,d?.version===VERSION?{...d,version:PREV}:d,...a);};
NS.Telemetry.prototype.toJSON=function(...a){const d=devlog.apply(this,a);d.version=VERSION;return d;};
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const names=['development','tradeIndex','rowsBuild','rowsSort','projectBusy','housingAttempt','storageRequirements','storageConstruction','commerceRequirements','commerceConstruction','industryReserve31H','militaryReserve32C1'];
let current=null,latest=null;
function empty(){return{calls:0,ms:0,maxMs:0,samples:[],exceptions:0};}
function measure(name,fn){const s=current;if(!s||!s.depth||!s.metrics[name])return fn();const stat=s.metrics[name],begin=clock();let failed=false;if(name==='development')s.inDevelopment++;try{return fn();}catch(e){failed=true;throw e;}finally{if(name==='development')s.inDevelopment--; const ms=Math.max(0,clock()-begin);stat.calls++;stat.ms+=ms;stat.maxMs=Math.max(stat.maxMs,ms);if(failed)stat.exceptions++;if(stat.samples.length<10000)stat.samples.push(ms);}}
function count(name,n=1){if(current&&current.depth)current.counts[name]=(current.counts[name]||0)+n;}
function isMeasuring(){return !!current&&current.depth>0;}
function isMeasuringDevelopment(){return isMeasuring()&&current.inDevelopment>0;}
function view(s){if(!s)return latest;const out={};for(const name of names){const x=s.metrics[name],sorted=x.samples.slice().sort((a,b)=>a-b);out[name]={calls:x.calls,totalMs:+x.ms.toFixed(2),meanMs:x.calls?+(x.ms/x.calls).toFixed(4):0,maxMs:+x.maxMs.toFixed(2),p95Ms:sorted.length?+sorted[Math.min(sorted.length-1,Math.ceil(.95*sorted.length)-1)].toFixed(2):0,exceptions:x.exceptions};}
return{format:'vilob-v035f-development-v1',version:VERSION,active:s.active,startTime:s.startTime,finishTime:s.finishTime,observedDays:s.days,quarterCount:s.quarters.length,metrics:out,counts:{...s.counts},seasonal:s.quarters,notes:['All new function timings are inclusive and overlap with development or with each other; do not sum nested measurements.','The profiled development branch executes only during 35F opt-in; the unprofiled 35E body is preserved verbatim.','StartConstruction attempts and policy reservations are not skipped; the profile does not establish an unprofiled speedup.']};}
function start(w){if(!w)throw Error('세계가 없습니다');if(current)stop();if(NS.V035E?.isActive?.()||NS.V035D?.isActive?.()||NS.V035C?.isActive?.()||NS.V035A?.isActive?.()||NS.V035B?.reportDetail?.()?.active)throw Error('다른 계측을 종료한 뒤 시작해 주세요.');
 const p=NS.V034C1B;if(typeof p?.setEnabled!=='function')throw Error('분기 프로파일러가 없습니다');
 const s={w,active:true,startTime:w.timestamp?.()||'',finishTime:null,days:0,depth:0,inDevelopment:0,counts:{},metrics:Object.fromEntries(names.map(x=>[x,empty()])),quarters:[],lastCal:null,restore:[],wasEnabled:!!p.summarize(w)?.enabled};
 p.setEnabled(w,true);
 function wrap(obj,k,handler){const original=obj[k];if(typeof original!=='function')throw Error('35F '+k+' 없음');const wrapped=function(...args){return handler.call(this,original,args);};obj[k]=wrapped;s.restore.push([obj,k,original,wrapped]);}
 function capture(){const q=p.summarize(w);if(q?.hasProfile&&q.sampleCount&&s.lastCal!==q.calendarDay){s.lastCal=q.calendarDay;s.quarters.push({year:q.year,season:q.season,calendarDay:q.calendarDay,outerMs:q.outerMs,stages:{...q.stages},missing:q.missingCheckpoints});}}
 try{wrap(NS.Village.prototype,'seasonalTick',function(orig,args){if(args[0]!==w)return orig.apply(this,args);s.depth++;try{return orig.apply(this,args);}finally{s.depth--;}});
 wrap(NS.World.prototype,'advanceOneDay',function(orig,args){if(this!==w)return orig.apply(this,args);try{return orig.apply(this,args);}finally{s.days++;capture();}});
 }catch(e){for(const [obj,k,orig,fn] of s.restore.reverse())if(obj[k]===fn)obj[k]=orig;if(!s.wasEnabled)p.setEnabled(w,false);throw e;}
 current=s;return view(s);
}
function stop(){if(!current)return latest;const s=current;s.active=false;for(const [obj,k,orig,fn] of s.restore.reverse())if(obj[k]===fn)obj[k]=orig;if(!s.wasEnabled)NS.V034C1B.setEnabled(s.w,false);s.finishTime=s.w.timestamp?.()||'';latest=view(s);current=null;return latest;}
function report(){return current?view(current):latest;}
function download(name,obj){if(typeof document==='undefined')return;const u=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...save,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족: JSON 내보내기를 이용해 주세요. '+e.message);}},
 load(){const d=localStorage.getItem(KEY);return d?NS.World.from(JSON.parse(d)):save.load?.();},
 export(w){download(`village-observer-v035F-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035F-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35FProfile(w){const r=report();if(!r)throw Error('35F 계측을 먼저 실행해 주세요');download(`vilob-v035F-development-${w.year}y.json`,r);}
};
const UI=NS.UI?.prototype;if(UI){const rw=UI.renderWorld;UI.renderWorld=function(...args){const ret=rw.apply(this,args);if(typeof document==='undefined')return ret;const parent=document.getElementById('v035ePanel')||document.getElementById('v035dPanel');if(!parent)return ret;let el=document.getElementById('v035fPanel');if(!el){el=document.createElement('div');el.id='v035fPanel';el.className='small muted';el.style.marginTop='8px';el.innerHTML='<strong>35F · 개발·건설 병목 상세 계측 (선택)</strong><div class="small muted">개발 후보·프로젝트 검사·창고/교역소 착공 및 산업/군사 슬롯 예약. 기본 OFF.</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:5px 0"><button type="button" id="v035fStart">35F 계측 시작</button><button type="button" id="v035fStop">35F 계측 종료</button><button type="button" id="v035fExport">35F JSON 저장</button></div><div id="v035fStatus"></div>';parent.appendChild(el);el.querySelector('#v035fStart').onclick=()=>{try{start(this.world);}catch(e){el.querySelector('#v035fStatus').textContent=String(e?.message||e);}};el.querySelector('#v035fStop').onclick=()=>stop();el.querySelector('#v035fExport').onclick=()=>NS.SaveSystem.export35FProfile(this.world);}const r=report(),status=el.querySelector('#v035fStatus');if(status)status.textContent=r?`관측 ${r.observedDays}일 · 분기 ${r.quarterCount}회 · 후보 ${(r.counts.candidateVisits||0).toLocaleString()}회 · ${r.active?'계측 중':'종료'}`:'계측 기록 없음';return ret;};
const rh=UI.renderHeader;UI.renderHeader=function(...args){const out=rh.apply(this,args);syncBadge();return out;};}
function syncBadge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-21',title:'Development & Construction Hotpath',summary:'개발 후보·건설 프로젝트·착공 및 산업·군사 건설 슬롯 예약의 병목을 구간별로 조사합니다. 기존 게임 결과는 그대로 유지합니다.',sections:[['개발 진단',['35F 선택형 계측으로 개발 후보·정렬·프로젝트 검사 및 창고·교역소 착공의 비용을 분리합니다.','산업시설·군사시설 슬롯 예약 판단을 별도로 추적합니다.']],['게임 동등성',['선택형 계측 OFF일 때 개발 판단의 35E 원래 구현을 그대로 실행합니다.','AI 건설 순서, 이벤트, 비용, RNG와 건설 실패의 부수효과를 생략하지 않습니다.']],['표시·유지',['최초 실행부터 좌상단 버전을 V0.35F로 표시합니다.','기술 43개, CSV 1683열, 보호 레거시 169블록을 유지합니다.']]]});
NS.V035F=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!current,isMeasuring,isMeasuringDevelopment,measure,count});
syncBadge();
})(window.VSim);

;
/* H1B2 bundled source: v035f1.js */
/* Village Observer V0.35F1 — Housing construction decision simplification.
 * A national seasonal demandDevelopment pass attempts the existing global
 * buildHouse implementation at most once; storage/commerce remain eligible.
 * Economic conservation, build cost, slot and project validation are unchanged.
 */
(function(NS){'use strict';
const VERSION='V0.35F1',PREV='V0.35F',KEY='village-observer-v035f1';
const previousFrom=NS.World.from,previousSerialize=NS.World.prototype.serialize;
const previousTelemetry=NS.Telemetry.prototype.toJSON,previousSave=NS.SaveSystem;
NS.World.prototype.serialize=function(...args){const d=previousSerialize.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(d,...args){return previousFrom.call(this,d?.version===VERSION?{...d,version:PREV}:d,...args);};
NS.Telemetry.prototype.toJSON=function(...args){const d=previousTelemetry.apply(this,args);d.version=VERSION;return d;};
function download(name,obj){if(typeof document==='undefined')return;const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function currentProfile(){const raw=NS.V035F.report();if(!raw)return null;return{...raw,format:'vilob-v035f1-development-v1',version:VERSION,notes:[
 '35F1: at most one global housing construction attempt per nation per seasonal demandDevelopment decision (including profiled path).',
 'housingEligible is the number of qualifying tile candidates; housingAttemptStarted35F1 is the actual number of attempts; housingSkippedRepeat35F1 counts repeat candidates deliberately skipped.',
 'Warehouse/trading-post decisions continue after a failed housing attempt; normal build checks, resource costs and project slots remain authoritative.',
 'Simulation decisions may differ from 35F; unprofiled same-save A/B is required for performance claims.',
 ...(raw.notes||[]).filter(x=>!x.includes('unprofiled 35E body is preserved verbatim')&&!x.includes('attempts and policy reservations are not skipped'))]};}
NS.SaveSystem={...previousSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족: JSON 내보내기를 이용해 주세요. '+e.message);}},
 load(){const str=localStorage.getItem(KEY);return str?NS.World.from(JSON.parse(str)):previousSave.load?.();},
 export(w){download(`village-observer-v035F1-save-${w.year}y.json`,w.serialize());},
 exportDevJSON(w){download(`village-observer-v035F1-devlog-${w.telemetry.sessionId}.json`,w.telemetry.toJSON(w));},
 export35FProfile(w){const r=currentProfile();if(!r)throw Error('계측을 먼저 실행해 주세요');download(`vilob-v035F1-development-${w.year}y.json`,r);},
 export35F1Profile(w){return this.export35FProfile(w);}
};
function syncBadge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const badge=document.getElementById('versionBadge');if(badge){badge.textContent='Village Observer · '+VERSION;badge.dataset.runtimeVersion=VERSION;}}
const ui=NS.UI?.prototype;if(ui){const oldHeader=ui.renderHeader;ui.renderHeader=function(...args){const r=oldHeader.apply(this,args);syncBadge();return r;};const oldWorld=ui.renderWorld;ui.renderWorld=function(...args){const r=oldWorld.apply(this,args);if(typeof document!=='undefined'){const panel=document.getElementById('v035fPanel');if(panel){const heading=panel.querySelector('strong');if(heading)heading.textContent='35F1 · 개발·건설 병목 상세 계측 (선택)';const exportButton=document.getElementById('v035fExport');if(exportButton)exportButton.textContent='35F1 JSON 저장';const helper=panel.querySelector('.small.muted');if(helper)helper.textContent='주택 건설 최대 1회/국가·분기 개발 판단 · 창고/교역소 검사 유지 · 기본 OFF';}}return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-22',title:'Housing Retry Simplification',summary:'분기 개발 판단당 주택 건설 시도를 국가별 최대 1회로 제한해 반복된 실패 탐색을 줄입니다. 창고·교역소 건설 판단과 모든 실제 비용·건설 슬롯 검사는 유지합니다.',sections:[['개발 AI 단순화',['국가별 분기 개발 판단에서 첫 주택 건설 시도 후에는 같은 판단 안의 추가 주택 시도를 생략합니다.','주택 건설 실패 후에도 창고 및 교역소 후보를 계속 확인합니다.','기존 주택 건설 함수가 담당하는 신축·개축·이주·토지정비·자원·건설 슬롯 규칙은 변경하지 않습니다.']],['성능 및 검증',['35F 계측에서 15번의 국가 개발 판단 동안 주택 건설 시도 464회 중 실패 463회, 주택 시도 시간 누적 6,839.6ms가 관찰됐습니다.','35F1 계측에서 주택 요청과 반복 생략 건수를 별도로 확인할 수 있습니다.','주택 건설 AI 결정과 RNG 순서는 35F와 달라질 수 있으며 경제·군사·회계 일관성은 유지해야 합니다.']],['유지',['좌상단 최초 화면 및 저장 파일 버전을 V0.35F1로 표시합니다.','기술 43개, CSV 1683열, 보호 레거시 169블록은 그대로 유지합니다.']]]});
NS.V035F1=Object.freeze({version:VERSION,report:currentProfile});
syncBadge();
})(window.VSim);

;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('35F_OBSERVATION_STACK',args[0],old,this,args):old.apply(this,args);};})(window.VSim);

;
/* H1B2 bundled source: v035g.js */
/* Village Observer 0.35G — Settlement construction labor / project recovery.
   Generated legacy 036 (not protected sources) owns the cycle allocations.
   This bootstrap only owns telemetry, exports, versioning and presentation. */
(function(NS){'use strict';
const VERSION='V0.35G',PREVIOUS='V0.35F1',SAVE_KEY='village-observer-v035g';
const kinds=['construction','upgrade','specialization','land'];
function N(x){const n=Number(x);return Number.isFinite(n)?n:0;}
function state(v){let s=v.v35g;if(!s||typeof s!=='object')v.v35g=s={};for(const k of ['cycles','progressCycles','remoteWorkers','workerAssignments','noSettlementWorkers','maintenanceAssigned','otherProjectAssigned','survivalReserve','landProgress','landNoLocal','localEmptyRecovered'])s[k]=N(s[k]);return s;}
function constructionScheduled(v,w,p,local,remote,n){const s=state(v);s.cycles++;s.workerAssignments+=n;s.remoteWorkers+=remote;if(!local&&remote)s.localEmptyRecovered++;p._v35gLastReason=remote?'PROGRESSED_SETTLEMENT':'PROGRESSED_LOCAL';p._v35gLastWorkers=n;p._v35gLastRemoteWorkers=remote;}
function constructionBlocked(v,w,p,reason,available,local){const s=state(v);s.cycles++;if(reason==='NO_SETTLEMENT_WORKERS')s.noSettlementWorkers++;if(reason==='MAINTENANCE_ASSIGNED')s.maintenanceAssigned++;if(reason==='OTHER_PROJECT_ASSIGNED')s.otherProjectAssigned++;if(reason==='SURVIVAL_LABOR_RESERVE')s.survivalReserve++;p._v35gStallCycles=N(p._v35gStallCycles)+1;p._v35gLastReason=reason;p._v35gLastWorkers=0;p._v35gLastRemoteWorkers=0;}
function constructionProgress(v,w,p,eff){if(eff<=0)return;const s=state(v);s.progressCycles++;p._v35gLastProgressCalendarDay=N(w.calendarOrdinalDay?.());p._v35gStallCycles=0;}
function landCycle(v,w,p,reason){const s=state(v);if(reason==='PROGRESSED'){s.landProgress++;p._v35gLastProgressCalendarDay=N(w.calendarOrdinalDay?.());p._v35gLastReason='LAND_PROGRESSED';}else{s.landNoLocal++;p._v35gLastReason='NO_LOCAL_WORKERS_LAND';}}
function rows(w){const data=[];for(const v of w.villages||[])for(const kind of kinds){const key=kind==='construction'?'constructionProjects':kind==='upgrade'?'buildingUpgradeProjects':kind==='specialization'?'specializationProjects':'landDevelopmentProjects';for(const p of v[key]||[]){if(kind==='construction'&&p.v17Marker)continue;const t=w.map.get(Number(p.tileId)),start=N(p.startCalendarDay25)||null,now=N(w.calendarOrdinalDay?.()),progress=N(p.laborProgress25??p.progress),total=Math.max(1,N(p.totalLabor25??p.duration));data.push({nationId:v.id,nation:v.name,kind,projectId:String(p.id??''),tileId:p.tileId,settlementId:t?.settlementId??'',type:p.type??p.to??'land_development',ageCalendarDays:start!=null?Math.max(0,now-start):'',approxAgeCalendarDays:start!=null?'':N(p.startDay)>0?Math.max(0,now-(N(p.startDay)-1)*3-1):'',startDateReliable:start!=null?1:0,observedAgeCalendarDays:p._v35gFirstSeenCal!=null?Math.max(0,now-N(p._v35gFirstSeenCal)):"",progress:+(100*progress/total).toFixed(2),lastProgressCalendarDay:p._v35gLastProgressCalendarDay??'',lastReason:(p.v33e5f1ControlPaused||p.v33e5fOccupationPaused?'CONTROL_PAUSED':p._v35gLastReason||'UNOBSERVED'),stalledCycles:N(p._v35gStallCycles),workers:N(p._v35gLastWorkers),sharedWorkers:N(p._v35gLastRemoteWorkers),totalLabor:total,progressLabor:progress});}}return data;}
function report(w){const pp=rows(w);return {format:'vilob-v035g-construction-v1',version:VERSION,time:w.timestamp?.()||'',calendarDay:N(w.calendarOrdinalDay?.()),nations:(w.villages||[]).map(v=>({id:v.id,name:v.name,stats:{...state(v)}})),projectCount:pp.length,activeProjects:pp,notes:['G uses real working-age residents in the same active Settlement; physical construction sites and costs are not changed.','Site workers have priority. Workers on maintenance missions, active military and pioneers cannot be assigned; one project per real Person per cycle.','LAND progress remains the original tile-local model in G. Its stalls are measured separately.','startDateReliable=0 means historical start calendar day is missing; approximate age from three-day legacy ordinal is an estimate only.']};}
function csv(w){const r=rows(w),fields=['nationId','nation','kind','projectId','tileId','settlementId','type','ageCalendarDays','approxAgeCalendarDays','startDateReliable','observedAgeCalendarDays','progress','lastProgressCalendarDay','lastReason','stalledCycles','workers','sharedWorkers','totalLabor','progressLabor'],q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';return '\ufeff'+[fields.map(q).join(','),...r.map(x=>fields.map(f=>q(x[f])).join(','))].join('\n');}
function dl(name,value,mime='application/json'){if(typeof document==='undefined')return;const blob=new Blob([value],{type:mime}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
const previousSerialize=NS.World.prototype.serialize,previousFrom=NS.World.from,previousTelemetry=NS.Telemetry.prototype.toJSON,previousSave=NS.SaveSystem,previousVillageSerialize=NS.Village.prototype.serialize;
NS.Village.prototype.serialize=function(...args){const d=previousVillageSerialize.apply(this,args);if(this.v35g)d.v35g=this.v35g;return d;};
NS.World.prototype.serialize=function(...args){const d=previousSerialize.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(d,...args){const w=previousFrom.call(this,d?.version===VERSION?{...d,version:PREVIOUS}:d,...args);if(d?.version===VERSION){for(const sv of d.villages||[]){const v=(w.villages||[]).find(v=>String(v.id)===String(sv.id));if(v&&sv.v35g)v.v35g=sv.v35g;}}return w;};
NS.Telemetry.prototype.toJSON=function(...args){const d=previousTelemetry.apply(this,args);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v35gConstruction={revision:'settlement-labor-pool-v1',...report(args[0]||NS._currentWorld||{villages:[],map:{get:()=>null}})};return d;};
NS.SaveSystem={...previousSave,
 save(w){try{localStorage.setItem(SAVE_KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('로컬 저장 공간 부족: JSON 파일로 저장해 주세요. '+e.message);}},
 load(){const raw=localStorage.getItem(SAVE_KEY);return raw?NS.World.from(JSON.parse(raw)):previousSave.load?.();},
 export(w){dl(`village-observer-v035G-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v035G-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 export35FProfile(w){const r=NS.V035F1?.report?.();if(!r)throw Error('35F 계측을 먼저 실행해 주세요');dl(`vilob-v035G-development-${w.year}y.json`,JSON.stringify({...r,version:VERSION,format:'vilob-v035g-development-v1'},null,2));},
 export35GConstructionJSON(w){dl(`vilob-v035G-construction-${w.year}y.json`,JSON.stringify(report(w),null,2));},
 export35GConstructionCSV(w){dl(`vilob-v035G-projects-${w.year}y.csv`,csv(w),'text/csv;charset=utf-8');}
};
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const e=document.getElementById('versionBadge');if(e){e.textContent='Village Observer · '+VERSION;e.dataset.runtimeVersion=VERSION;}}
const UI=NS.UI?.prototype;
if(UI){const header=UI.renderHeader;UI.renderHeader=function(...a){const r=header.apply(this,a);badge();return r;};const original=UI.renderWorld;UI.renderWorld=function(...a){const r=original.apply(this,a);if(typeof document==='undefined')return r;const panel=document.getElementById('v035fPanel');if(panel){let buttons=document.getElementById('v035gConstructionExports');if(!buttons){buttons=document.createElement('div');buttons.id='v035gConstructionExports';buttons.className='small';buttons.style.cssText='margin-top:8px;display:flex;flex-wrap:wrap;gap:6px';for(const [name,action] of [['35G 공사별 CSV','export35GConstructionCSV'],['35G 공사 정체 JSON','export35GConstructionJSON']]){const b=document.createElement('button');b.textContent=name;b.addEventListener('click',()=>NS.SaveSystem[action](this.world));buttons.appendChild(b);}panel.appendChild(buttons);}}badge();return r;};}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-22',title:'Construction Labor & Project Recovery V1',summary:'같은 Settlement의 실제 주민이 건설 노동을 공유하여 현장 타일에 주민이 없어 멈추는 공사를 줄입니다. 별도 공사 CSV와 정체 JSON을 제공합니다.',sections:[['건설 노동',['일반 신축·개축·고도화: 3일 노동 주기마다 같은 Settlement 성인 인력을 공유합니다.','현장 주민을 우선하고 다른 타일의 실제 주민이 지원하며, 유지보수·군인·개척자 및 중복 공사 배정을 차단합니다.','장기 정체된 일반 공사에 최대 10점의 제한적인 우선순위 가산을 적용합니다.']],['진단',['G 공사별 CSV 및 정체 JSON 다운로드를 제공합니다.','토지정비는 기존 진행식 그대로이며 현장 주민 부족 상태만 관측합니다.','건물 비용·공사 노동일·건설 슬롯·물리 자원 회계는 유지됩니다.']],['호환·성능',['35F1 세이브 이관을 지원하며 신규 저장 키를 사용합니다.','기술 43개, 정규 CSV 1683열 및 보호 레거시 169블록은 유지합니다.']]]});
NS.V035G=Object.freeze({version:VERSION,constructionScheduled,constructionBlocked,constructionProgress,landCycle,report,csv});badge();
})(window.VSim);

;
/* H1B2 bundled source: v035g1a.js */
/* Village Observer V0.35G1 — Abstract baseline construction + real architect dispatch */
(function(NS){'use strict';
const VERSION='V0.35G1A',PREVIOUS='V0.35G',KEY='village-observer-v035g1a';
const BASE_DAILY=.80,LAND_PER_TICK=.55,LOCAL_PER_ADULT=.05,LOCAL_MAX=.25,ARCH_MULT=3.0,REVIEW_DAYS=30;
const TYPES=[['constructionProjects','construction'],['buildingUpgradeProjects','upgrade'],['specializationProjects','specialization'],['landDevelopmentProjects','land']];
const num=x=>Number.isFinite(Number(x))?Number(x):0;
function state(v){const s=v.v35g1||(v.v35g1={});for(const k of ['baselineCycles','baselineEffective','architectEffectiveExtra','architectWorkCycles','architectTravelDays','architectDispatches','architectReturns','architectInvalidations','landCycles','completionReleases','blockedControlCycles'])s[k]=num(s[k]);return s;}
function projectRows(v,w){const rows=[];for(const [key,kind] of TYPES)for(const p of v[key]||[]){if(p.v17Marker)continue;const t=w.map.get(Number(p.tileId));if(!t||String(t.ownerId)!==String(v.id)||p.v33e5f1ControlPaused||p.v33e5fOccupationPaused)continue;rows.push({p,kind,t,key});}return rows;}
function adultCounts(v,w){const counts=new Map();for(const p of v.residents||[]){if(!p.alive||p.age<16||p.assignment==='PIONEER'||p.militaryStatus32A==='active')continue;const t=w.map.get(Number(p.homeTileId));if(!t||String(t.ownerId)!==String(v.id))continue;const k=t.settlementId==null?'tile:'+t.id:String(t.settlementId);counts.set(k,(counts.get(k)||0)+1);}return counts;}
function localFactor(v,w,t){let cache=v._v35g1LocalCache;const now=num(w.calendarOrdinalDay?.());if(!cache||now-cache.day>=30||now<cache.day){cache={day:now,counts:adultCounts(v,w)};v._v35g1LocalCache=cache;}const k=t.settlementId==null?'tile:'+t.id:String(t.settlementId);return 1+Math.min(LOCAL_MAX,LOCAL_PER_ADULT*(cache.counts.get(k)||0));}
function freeArchitect(p){return p?.alive&&p.age>=16&&p.job==='건축가'&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'&&!(p.v25MaintenanceQueue||[]).length&&!p.v35g1Dispatch;}
function release(p,v){if(!p.v35g1Dispatch)return;delete p.v35g1Dispatch;delete p._v25CycleTask;p.workTileId=p.homeTileId;state(v).architectReturns++;}
function startReturn(p,v,d,now){if(!d||d.phase==='RETURN')return;d.phase='RETURN';d.remaining=Math.max(0,num(d.backCost));d.lastCal=now;state(v).completionReleases++;}
function verify(p,v,w,lookup,now){const d=p.v35g1Dispatch;if(!d)return;
 if(!p.alive||p.age<16||p.job!=='건축가'||p.assignment==='PIONEER'||p.militaryStatus32A==='active'||(p.v25MaintenanceQueue||[]).length){release(p,v);state(v).architectInvalidations++;return;}
 const row=lookup.get(d.kind+':'+d.projectId),owner=row&&String(row.t.ownerId)===String(v.id);
 if(!owner){startReturn(p,v,d,now);if(!num(d.remaining))release(p,v);return;}
 // Occupation pauses the work but preserves real architect; travel/return are unchanged.
 if(row.p.v33e5f1ControlPaused||row.p.v33e5fOccupationPaused)d.paused=true;else d.paused=false;
}
function dispatch(v,w,rows,lookup,now){const people=v.residents||[],ready=people.filter(freeArchitect);if(!ready.length)return;
 const claimed=new Set(people.map(p=>p.v35g1Dispatch).filter(Boolean).filter(d=>d.phase!=='RETURN').map(d=>d.kind+':'+d.projectId));
 const todo=rows.filter(r=>!claimed.has(r.kind+':'+r.p.id)).sort((a,b)=>{
  const priority=x=>x.kind==='construction'?(x.p.type==='house'?120:x.p.type==='road'?65:90):x.kind==='land'?70:85;
  const remain=x=>x.kind==='land'?Math.max(0,num(x.p.duration)-num(x.p.progress)):Math.max(0,num(x.p.totalLabor25)-num(x.p.laborProgress25));
  return priority(b)-priority(a)||remain(b)-remain(a)||num(a.p.startDay)-num(b.p.startDay);
 });
 for(const row of todo){if(!ready.length)break;
  // Physical distance pre-shortlist, detailed real path only for a handful of candidates.
  const shortlist=ready.map(p=>({p,straight:Number(w.map.distance?.(p.homeTileId,row.p.tileId)??Math.abs(Number(p.homeTileId)-Number(row.p.tileId)))})).sort((a,b)=>a.straight-b.straight||String(a.p.id).localeCompare(String(b.p.id))).slice(0,5);
  let best=null;
  for(const c of shortlist){const home=w.map.get(Number(c.p.homeTileId));if(!home||String(home.ownerId)!==String(v.id))continue;
   const same=home.settlementId!=null&&home.settlementId===row.t.settlementId;
   const cost=same?0:Number(v.internalPathCost?.(c.p.homeTileId,row.p.tileId)??c.straight);
   if(!Number.isFinite(cost)||cost<0)continue;
   const remaining=row.kind==='land'?Math.max(0,num(row.p.duration)-num(row.p.progress))/Math.max(.01,LAND_PER_TICK):Math.max(0,num(row.p.totalLabor25)-num(row.p.laborProgress25))/Math.max(.01,BASE_DAILY*3);
   if(remaining<Math.max(9,2*cost+3))continue; // avoid dispatching for almost-complete work
   if(!best||cost<best.cost)best={p:c.p,cost};
  }
  if(!best)continue;
  const {p,cost}=best;p.v35g1Dispatch={projectId:String(row.p.id),kind:row.kind,tileId:Number(row.p.tileId),phase:cost>0?'OUT':'WORK',remaining:cost,backCost:cost,lastCal:now,paused:false};
  if(cost===0)p.workTileId=row.p.tileId;state(v).architectDispatches++;claimed.add(row.kind+':'+row.p.id);ready.splice(ready.indexOf(p),1);
 }
}
function prepare(v,w){const now=num(w.calendarOrdinalDay?.()),rows=projectRows(v,w),lookup=new Map(rows.map(r=>[r.kind+':'+r.p.id,r]));
 const s=state(v);for(const p of v.residents||[]){if(!p.v35g1Dispatch)continue;verify(p,v,w,lookup,now);const d=p.v35g1Dispatch;if(!d)continue;
  const elapsed=Math.min(3,Math.max(0,now-num(d.lastCal)));
  if(d.phase==='OUT'||d.phase==='RETURN'){
   const moved=Math.min(elapsed,num(d.remaining));d.remaining=Math.max(0,num(d.remaining)-moved);s.architectTravelDays+=moved;
   if(d.remaining<=1e-9){if(d.phase==='RETURN'){release(p,v);continue;}d.phase='WORK';p.workTileId=d.tileId;}
  }
  d.lastCal=now;
 }
 if(!Number.isFinite(v._v35g1LastReview)||now-v._v35g1LastReview>=REVIEW_DAYS||now<v._v35g1LastReview){dispatch(v,w,rows,lookup,now);v._v35g1LastReview=now;}
 // Build one indexed lookup per cycle; no Person rescans for each construction project.
 const idx=new Map();
 for(const p of v.residents||[]){const d=p.v35g1Dispatch;if(!d)continue;
  p._v25CycleTask={kind:'construction',projectKind:d.kind,projectId:d.projectId,tileId:d.tileId,type:d.phase==='WORK'?'ARCHITECT_WORK':'ARCHITECT_TRAVEL'};
  if(d.phase==='WORK'&&!d.paused&&p.alive)idx.set(d.kind+':'+d.projectId,p);
 }
 v._v35g1CycleArchitectIndex=idx;
}
function actualArchitect(v,p,kind){const key=kind+':'+String(p.id),candidate=v._v35g1CycleArchitectIndex?.get(key);if(candidate?.alive&&candidate.v35g1Dispatch?.phase==='WORK'&&!candidate.v35g1Dispatch.paused&&!(candidate.v25MaintenanceQueue||[]).length)return candidate;
 // Fallback for first-cycle tests / save restoration before first scheduled labor plan.
 if(!v._v35g1CycleArchitectIndex)for(const x of v.residents||[])if(x.alive&&x.v35g1Dispatch?.phase==='WORK'&&x.v35g1Dispatch.kind===kind&&x.v35g1Dispatch.projectId===String(p.id)&&!x.v35g1Dispatch.paused)return x;return null;}
function record(v,w,p,base,kind,architect){const s=state(v);s.baselineCycles++;s.baselineEffective+=base;s.architectEffectiveExtra+=architect?base*(ARCH_MULT-1):0;
 if(architect)s.architectWorkCycles++;
 p._v35gLastReason=architect?'G1A_ARCHITECT_3_0X':'G1A_BASELINE';p._v35gLastWorkers=architect?1:0;p._v35gLastRemoteWorkers=architect&&architect.homeTileId!==p.tileId?1:0;
 p._v35gFirstSeenCal=p._v35gFirstSeenCal??num(w.calendarOrdinalDay?.());p._v35gLastProgressCalendarDay=num(w.calendarOrdinalDay?.());p._v35gStallCycles=0;
}
function work(v,w,p,kind){const t=w.map.get(Number(p.tileId));if(!t||String(t.ownerId)!==String(v.id)||p.v33e5f1ControlPaused||p.v33e5fOccupationPaused){state(v).blockedControlCycles++;return 0;}
 const architect=actualArchitect(v,p,kind),base=3*BASE_DAILY*localFactor(v,w,t),eff=base*(architect?ARCH_MULT:1);
 record(v,w,p,base,kind,architect);
 // Virtual work is not Person labor; keep existing laborStats25.construction counters honest.
 return eff;
}
function landWork(v,w,p){const t=w.map.get(Number(p.tileId));if(!t||String(t.ownerId)!==String(v.id)||p.v33e5f1ControlPaused||p.v33e5fOccupationPaused)return 0;
 const architect=actualArchitect(v,p,'land'),base=LAND_PER_TICK*localFactor(v,w,t),eff=base*(architect?ARCH_MULT:1);
 record(v,w,p,base,'land',architect);state(v).landCycles++;return eff;
}
function report(w){const live=[];for(const v of w.villages||[]){for(const p of v.residents||[])if(p.v35g1Dispatch)live.push({nation:v.name,person:p.name,personId:p.id,...p.v35g1Dispatch});}
 return {format:'vilob-v035g1-construction-v1',version:VERSION,day:num(w.calendarOrdinalDay?.()),constants:{baseDaily:BASE_DAILY,landPerTick:LAND_PER_TICK,localPerAdult:LOCAL_PER_ADULT,localMax:LOCAL_MAX,architectMultiplier:ARCH_MULT,reviewDays:REVIEW_DAYS},nations:(w.villages||[]).map(v=>({id:v.id,name:v.name,stats:{...state(v)}})),activeDispatches:live};}
const priorFrom=NS.World.from,priorSer=NS.World.prototype.serialize,priorVSer=NS.Village.prototype.serialize,priorTele=NS.Telemetry.prototype.toJSON,priorSave=NS.SaveSystem;
NS.Village.prototype.serialize=function(...args){const d=priorVSer.apply(this,args);d.v35g1=this.v35g1||null;d._v35g1LastReview=num(this._v35g1LastReview)||null;return d;};
NS.World.prototype.serialize=function(...args){const d=priorSer.apply(this,args);d.version=VERSION;return d;};
NS.World.from=function(d,...args){const g1=(d?.version===VERSION||d?.version==='V0.35G1'),w=priorFrom.call(this,g1?{...d,version:PREVIOUS}:d,...args);if(g1)for(const sv of d.villages||[]){const v=w.villages.find(x=>String(x.id)===String(sv.id));if(v){if(sv.v35g1)v.v35g1=sv.v35g1;if(sv._v35g1LastReview!=null)v._v35g1LastReview=sv._v35g1LastReview;}}return w;};
NS.Telemetry.prototype.toJSON=function(...args){const d=priorTele.apply(this,args);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v35g1Construction=report(args[0]||NS._currentWorld||{villages:[],map:{get:()=>null}});return d;};
function dl(name,content,mime='application/json'){if(typeof document==='undefined')return;const u=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...priorSave,
 save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('로컬 저장 공간 부족: JSON 파일로 저장해 주세요. '+e.message);}},
 load(){const r=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v035g1');return r?NS.World.from(JSON.parse(r)):priorSave.load?.();},
 export(w){dl(`village-observer-v035G1A-save-${w.year}y.json`,JSON.stringify(w.serialize()));},
 exportDevJSON(w){dl(`village-observer-v035G1A-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},
 export35G1Construction(w){dl(`vilob-v035G1A-construction-${w.year}y.json`,JSON.stringify(report(w),null,2));}
};
const badge=()=>{if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const e=document.getElementById('versionBadge');if(e){e.textContent='Village Observer · '+VERSION;e.dataset.runtimeVersion=VERSION;}};
if(NS.UI){const h=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const r=h.apply(this,a);badge();return r;};const rr=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...a){const r=rr.apply(this,a);if(typeof document==='undefined')return r;const panel=document.getElementById('v035gConstructionExports');if(panel&&!document.getElementById('v035g1ConstructionExport')){const b=document.createElement('button');b.id='v035g1ConstructionExport';b.textContent='35G1A 추상 건설·건축가 JSON';b.addEventListener('click',()=>NS.SaveSystem.export35G1Construction(this.world));panel.appendChild(b);}badge();return r;};
 const codex=NS.UI.prototype.renderCodex;NS.UI.prototype.renderCodex=function(...a){const r=codex.apply(this,a);const root=this.q?.('codexContent');for(const x of root?.querySelectorAll?.('.v25-labor-note')||[])x.innerHTML='<strong>V0.35G1A 추상 건설</strong><br>일반 공사는 실제 Person 배정 없이 기본 속도로 진행합니다. Settlement 성인 인구 보정은 최대 +25%, 실제 건축가를 파견하면 현장 작업 중 ×3.0가 적용됩니다. 분기 유지보수 노동은 실제 Person으로 처리하며 별도입니다.';return r;};
}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Construction Speed Rebalance',summary:'기본 건설력 하루 0.25→0.80, 건축가 가속 ×2.5→×3.0. 지역 보정 +5%/성인·상한 +25%와 기술 효과는 유지합니다.',sections:[['건설 모델',['신축·개축·고도화에 하루 0.80 진척 단위의 기본 건설력을 적용합니다.','Settlement 성인 인구 한 명당 +5%, 최대 +25%의 지역 보정이 적용됩니다.','토지정비는 기존 기간 단위를 유지하고 작업 주기당 0.55 진척 기본값을 적용합니다.']],['건축가 파견',['실제 건축가를 30일마다 공사 현장에 파견합니다.','다른 Settlement의 경우 실제 경로 이동 후 현장 작업 중 ×3.0 가속이 적용되며, 완공 후 귀환합니다.','유지보수 중인 건축가·현역 군인·개척자는 파견하지 않으며 다른 생산 활동과 이중 수행하지 않습니다.']],['회계·호환',['건설 자원·Gold·슬롯·점령 중단 및 기존 기술 효과는 유지됩니다.','V0.35G와 G1 세이브 가져오기를 지원하며 G1A 별도 저장 키를 사용합니다.','실제 Person 노동 통계와 가상 건설 진척 계측을 분리하고 진단 JSON을 제공합니다.']]]});
NS.V035G1=Object.freeze({version:VERSION,prepare,work,landWork,report,localFactor,constants:{BASE_DAILY,LAND_PER_TICK,ARCH_MULT,REVIEW_DAYS}});NS.V035G1A=NS.V035G1;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.35G1'))NS.PATCH_NOTES.splice(1,0,{version:'V0.35G1',date:'2026-10-22',title:'Construction Abstraction + Architect Dispatch V1',summary:'무인력 기본 건설력 0.25/일, 건축가 파견 ×2.5를 도입했습니다.'});badge();
})(window.VSim);

;
/* H1B2 bundled source: v035h0.js */
/* V0.35H0 — Late Game Migration Route-Cache + Performance Telemetry.
 * Read-only Settlement housing calculations; existing construction and food accounting stay authoritative.
 */
(function(NS){'use strict';
const VERSION='V0.35H0',PREVIOUS='V0.35G1A',KEY='village-observer-v035h0';
const WAIT=825,REVIEW=30,MAX_RESCUE=3,RETRY=360,HAPPINESS_PENALTY=3,FOOD_DAYS=18;
const N=x=>Number.isFinite(Number(x))?Number(x):0,eq=(a,b)=>String(a)===String(b),cal=w=>N(w.calendarOrdinalDay?.()??w.ordinalDay?.());
const statsKeys=['reviews','domesticMoves','domesticNoVacancy','domesticRouteBlocks','domesticFoodBlocks','foreignEligible','foreignApplications','foreignAccepted','foreignDenied','foreignReturns','foreignNoBorder','foreignCooldown','foreignNoRoute','foreignNoVacancy','foodMigrations','foodMigrationBlocked'];
function stats(v){if(!v.v35g1bStats)v.v35g1bStats={};for(const k of statsKeys)if(!Number.isFinite(Number(v.v35g1bStats[k])))v.v35g1bStats[k]=0;return v.v35g1bStats;}
function rows(v,w){return NS.V034D2.context(v,w).map(h=>({...h,free:Math.max(0,Math.floor(h.vacancy+1e-7)),short:Math.max(0,Math.ceil(h.shortage-1e-7)),home:Number(h.coreTileId)}));}
function foodDays(v,h){const f=Number(v.settlementReserveDays?.(h.home));return Number.isFinite(f)?f:Number(v.foodReserveDays?.()||0);}
function allowed(v,h){return h&&h.free>=1&&foodDays(v,h)>=FOOD_DAYS&&h.tileIds.some(id=>Number(id)===Number(h.home));}
function safeControl(w,h){return h.tileIds.some(id=>{const t=w.map.get(Number(id));return t&&eq(t.ownerId,h.nationId)&&t.v33OccupierId==null&&!t.v33OccupationOperation;});}
function path(w,fromIds,toIds,allow){const goal=new Set(toIds.map(Number)),seen=new Set(),queue=[];for(const id of fromIds){const t=w.map.get(Number(id));if(t&&allow(t)){seen.add(Number(id));queue.push({id:Number(id),d:0});}}
 for(let i=0;i<queue.length;i++){const cur=queue[i];if(goal.has(cur.id))return cur.d;for(const t of w.map.neighbors4(cur.id)||[]){if(seen.has(t.id)||!allow(t))continue;seen.add(t.id);queue.push({id:t.id,d:cur.d+1});}}return Infinity;}
// H0: A scoped, multi-source BFS is shared across destination queries from one Settlement.
// No RNG/Person mutation. Scope lifetime: one nation voluntary review or one world housing review.
// The allowed-nation signature is part of the key (own nation vs two-country border).
let routeScope=null;
const routeFields=['queries','searches','hits','tilesVisited','outOfScope','profiledSearchMs'];
function routingStats(w){let d=w._v35h0Routing;if(!d){d={};w._v35h0Routing=d;}for(const k of routeFields)if(!Number.isFinite(d[k]))d[k]=0;return d;}
function routeContext(w,fn){const prior=routeScope;routeScope={world:w,maps:new Map()};try{return fn();}finally{routeScope=prior;}}
function ownedPath(w,a,b,nations){
 const st=routingStats(w);st.queries++;
 const ids=new Set(nations.map(String));
 if(!routeScope||routeScope.world!==w){st.outOfScope++;return path(w,a.tileIds,b.tileIds,t=>t.ownerId!=null&&ids.has(String(t.ownerId))&&t.v33OccupierId==null&&!t.v33OccupationOperation);}
 // Source id, actual member ids, and permitted ownership set uniquely identify the traversal.
 const signature=[...ids].sort().join(',');
 const key=signature+'|'+String(a.settlementId)+'|'+a.tileIds.map(Number).join(',');
 let dist=routeScope.maps.get(key);
 if(dist){st.hits++;}else{
  st.searches++;
  const profile=w._v35h0RouteProfile===true&&typeof performance!=='undefined'&&typeof performance.now==='function';
  const start=profile?performance.now():0;
  dist=new Map();const queue=[];
  const permit=t=>t&&t.ownerId!=null&&ids.has(String(t.ownerId))&&t.v33OccupierId==null&&!t.v33OccupationOperation;
  for(const src of a.tileIds){const id=Number(src),t=w.map.get(id);if(permit(t)&&!dist.has(id)){dist.set(id,0);queue.push(id);}}
  for(let i=0;i<queue.length;i++){
   const id=queue[i],next=dist.get(id)+1;
   for(const t of w.map.neighbors4(id)||[]){if(!permit(t)||dist.has(t.id))continue;dist.set(t.id,next);queue.push(t.id);}
  }
  st.tilesVisited+=queue.length;
  if(profile)st.profiledSearchMs+=performance.now()-start;
  routeScope.maps.set(key,dist);
 }
 let best=Infinity;for(const tid of b.tileIds){const n=dist.get(Number(tid));if(n!=null&&n<best)best=n;}
 return best;
}
function chooseHome(w,h,near){return [...h.tileIds].filter(id=>{const t=w.map.get(Number(id));return eq(t?.ownerId,h.nationId)&&t.v33OccupierId==null&&!t.v33OccupationOperation;}).sort((a,b)=>w.map.distance(Number(a),Number(near))-w.map.distance(Number(b),Number(near))||Number(a)-Number(b))[0]??h.home;}
function invalidate(v){v._v26ResidentEpoch=N(v._v26ResidentEpoch)+1;v._v26ResidentIndex=null;v._v27Shared=null;v._v28Rows=null;v._v28Summary=null;v._v29LaborForceDirty=true;}
function applyHome(v,w,p,h,reason){const before=Number(p.homeTileId),dest=chooseHome(w,h,before);p.homeTileId=Number(dest);p.workTileId=Number(dest);p.lastMoveDay=N(w.ordinalDay?.());p._v28PreviousHomeTileId=before;p._v28LastUrbanMoveCalendar=cal(w);p._v35g1bResidenceSinceCal=cal(w);p._v35g1bResidenceSettlementId=String(h.settlementId);p.currentAction='새 정착지에 정착 중';const cost=Math.min(Math.max(0,N(p.gold29)),.03+Math.max(0,w.map.distance(before,Number(dest))-1)*.015);if(cost>0){p.gold29-=cost;const t=w.map.get(Number(dest));t.v29Economy=t.v29Economy||{};t.v29Economy.marketGold=N(t.v29Economy.marketGold)+cost;v.v29Stats=v.v29Stats||{};v.v29Stats.migrationCosts=N(v.v29Stats.migrationCosts)+cost;}invalidate(v);v.migrationStats=v.migrationStats||{};v.migrationStats.internal=N(v.migrationStats.internal)+1;stats(v).domesticMoves++;w.telemetry?.record?.('HOUSING_DOMESTIC_MOVE35G1B',w,{nation:v.name,person:p.name,fromTileId:before,toTileId:dest,fromSettlementId:NS.V034D2.record(w,before)?.id,toSettlementId:h.settlementId,reason});}
function eligiblePerson(p){return p&&p.alive!==false&&p.age>=16&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'&&!p.v35g1Dispatch;}
function candidate(v,w,h,now,urgent){const list=(v.residents||[]).filter(p=>eligiblePerson(p)&&h.tileIds.some(id=>Number(id)===Number(p.homeTileId))&&(urgent||now-N(p._v28LastUrbanMoveCalendar??-99999)>=900));list.sort((a,b)=>N(a._v35g1bResidenceSinceCal??-99999)-N(b._v35g1bResidenceSinceCal??-99999)||String(a.id).localeCompare(String(b.id)));return list[0]||null;}
function safeDestinations(v,w,source,all){let noFood=0,noRoute=0;const out=[];for(const h of all){if(eq(h.settlementId,source.settlementId)||h.free<1)continue;if(!allowed(v,h)||!safeControl(w,h)){noFood++;continue;}const d=ownedPath(w,source,h,[v.id]);if(!Number.isFinite(d)){noRoute++;continue;}out.push({h,d});}return {out:out.sort((a,b)=>a.d-b.d||b.h.free-a.h.free||String(a.h.settlementId).localeCompare(String(b.h.settlementId))),noFood,noRoute};}
function domestic(v,w,all,source,limit=MAX_RESCUE){let moved=0;const st=stats(v),now=cal(w);for(let k=0;k<limit&&source.short>0;k++){
  const options=safeDestinations(v,w,source,all);if(!options.out.length){if(!all.some(h=>!eq(h.settlementId,source.settlementId)&&h.free>=1))st.domesticNoVacancy++;else{st.domesticFoodBlocks+=options.noFood>0?1:0;st.domesticRouteBlocks+=options.noRoute>0?1:0;}break;}
  const p=candidate(v,w,source,now,true);if(!p)break;const dest=options.out[0].h;applyHome(v,w,p,dest,'SHARED_HOUSING_SHORTAGE');source.population--;source.short=Math.max(0,Math.ceil(source.population-source.capacity-1e-7));source.free=Math.max(0,Math.floor(source.capacity-source.population+1e-7));dest.population++;dest.free=Math.max(0,Math.floor(dest.capacity-dest.population+1e-7));dest.short=Math.max(0,Math.ceil(dest.population-dest.capacity-1e-7));moved++;
 }return moved;}
function borders(w,v){const found=new Set();for(const id of v.territory||[])for(const t of w.map.neighbors4(id)||[])if(t.ownerId!=null&&!eq(t.ownerId,v.id))found.add(String(t.ownerId));return found;}
function selectForeign(v,w,source,allByNation){const border=borders(w,v),options=[];for(const dest of w.activeVillages||[]){if(!border.has(String(dest.id))||dest.status!=='active')continue;for(const h of allByNation.get(String(dest.id))||[]){const distance=ownedPath(w,source,h,[v.id,dest.id]);if(Number.isFinite(distance))options.push({nation:dest,h,distance});}}
 options.sort((a,b)=>a.distance-b.distance||Number(a.nation.id)-Number(b.nation.id)||String(a.h.settlementId).localeCompare(String(b.h.settlementId)));return options;}
function applyForeign(w,origin,target,p,h,reason){const oldHome=Number(p.homeTileId);NS.V033I1?.returnEquipment?.(origin,w,p,'EXTERNAL_MIGRATION');origin.residents=origin.residents.filter(x=>x.id!==p.id);p.villageId=target.id;p.homeTileId=chooseHome(w,h,oldHome);p.workTileId=p.homeTileId;p.lastMoveDay=N(w.ordinalDay?.());p._v35g1bResidenceSinceCal=cal(w);p._v35g1bResidenceSettlementId=String(h.settlementId);p._v35g1bLastForeignResult='ACCEPTED';p._v35g1bApplicationOrigin=null;p._v35g1bNextForeignCal=cal(w)+RETRY;p.assignment=null;
 target.residents.push(p);origin.migrationStats.externalOut=N(origin.migrationStats?.externalOut)+1;target.migrationStats.externalIn=N(target.migrationStats?.externalIn)+1;origin.relations[target.id]=N(origin.relations?.[target.id])+1;invalidate(origin);invalidate(target);
 w.log(`${p.name}이(가) ${reason==='HOUSING'?'장기 주거 부족':'식량난'}으로 ${origin.name}에서 ${target.name}의 정착지로 이주했습니다.`,true,'MIGRATION',{person:p.name,personId:p.id,from:origin.name,to:target.name,fromTileId:oldHome,toTileId:p.homeTileId,toSettlementId:h.settlementId,reason,model:VERSION});}
function admission(nation,w,h,p){const live=NS.V034D2?.housingAt?.(nation,w,h.home);if(live&&live.vacancy<1-1e-7)return'LOCAL_CAPACITY_OR_FOOD';if(!safeControl(w,h))return'CONTROL';const probability=Math.max(0,Math.min(1,Number(nation.v35g1bImmigrationAcceptance??1)));if(!allowed(nation,h))return'LOCAL_CAPACITY_OR_FOOD';if(String(w.map.get(h.home)?.ownerId)!==String(nation.id))return'CONTROL';if(probability<1&&Math.random()>=probability)return'POLICY_DENIED';return null;}
function attempt(v,w,p,target,h,step){const st=stats(v);st.foreignApplications++;p.happiness=Math.max(0,N(p.happiness)-HAPPINESS_PENALTY);p._v35g1bLastForeignAttemptCal=cal(w);const reason=admission(target,w,h,p);w.telemetry?.record?.(reason?'HOUSING_FOREIGN_DENIED35G1B':'HOUSING_FOREIGN_APPROVED35G1B',w,{person:p.name,origin:v.name,destination:target.name,settlementId:h.settlementId,step,reason:reason||'ACCEPTED',happiness:p.happiness});if(reason)st.foreignDenied++;return reason;}
function foreignHousing(v,w,source,allByNation){const st=stats(v),now=cal(w);const p=(v.residents||[]).filter(x=>eligiblePerson(x)&&source.tileIds.some(id=>Number(id)===Number(x.homeTileId))&&now-N(x._v35g1bResidenceSinceCal??now)>=WAIT&&now>=N(x._v35g1bNextForeignCal??0)).sort((a,b)=>N(a._v35g1bLastForeignAttemptCal??-99999)-N(b._v35g1bLastForeignAttemptCal??-99999))[0];if(!p){st.foreignCooldown++;return false;}st.foreignEligible++;
 const choices=selectForeign(v,w,source,allByNation);if(!choices.length){st.foreignNoBorder++;return false;}const first=choices[0];const originalTile=Number(p.homeTileId);p._v35g1bApplicationOrigin={nationId:v.id,settlementId:source.settlementId,tileId:originalTile};const no1=attempt(v,w,p,first.nation,first.h,1);if(!no1){applyForeign(w,v,first.nation,p,first.h,'HOUSING');st.foreignAccepted++;return true;}
 const alternates=(allByNation.get(String(first.nation.id))||[]).filter(h=>!eq(h.settlementId,first.h.settlementId)).map(h=>({h,d:ownedPath(w,source,h,[v.id,first.nation.id])})).filter(x=>Number.isFinite(x.d)).sort((a,b)=>a.d-b.d||String(a.h.settlementId).localeCompare(String(b.h.settlementId)));if(alternates.length){const second=alternates[0];const no2=attempt(v,w,p,first.nation,second.h,2);if(!no2){applyForeign(w,v,first.nation,p,second.h,'HOUSING');st.foreignAccepted++;return true;}}
 p._v35g1bLastForeignResult='RETURNED';p._v35g1bNextForeignCal=now+RETRY;p._v35g1bApplicationOrigin=null;st.foreignReturns++;w.telemetry?.record?.('HOUSING_FOREIGN_RETURN35G1B',w,{person:p.name,nation:v.name,settlementId:source.settlementId,tileId:originalTile,reason:alternates.length?'TWO_DENIALS':'NO_SECOND_SETTLEMENT'});return false;
}
function month(w){const now=cal(w);if(now<1||now%REVIEW!==0||w._v35g1bLastReview===now)return;w._v35g1bLastReview=now;return routeContext(w,()=>{const byNation=new Map();for(const v of w.activeVillages||[])byNation.set(String(v.id),rows(v,w));
 for(const v of [...w.activeVillages||[]]){const st=stats(v),all=byNation.get(String(v.id))||[],since=v.v35g1bHousingSince||(v.v35g1bHousingSince={});st.reviews++;const active=new Set();for(const h of all){if(h.population<=0||h.short<1)continue;active.add(String(h.settlementId));if(!Number.isFinite(Number(since[h.settlementId])))since[h.settlementId]=now;for(const p of v.residents||[])if(p.alive!==false&&h.tileIds.some(id=>Number(id)===Number(p.homeTileId))&&String(p._v35g1bResidenceSettlementId)!==String(h.settlementId)){p._v35g1bResidenceSettlementId=String(h.settlementId);p._v35g1bResidenceSinceCal=now;}}
 for(const k of Object.keys(since))if(!active.has(k))delete since[k];const pressured=all.filter(h=>h.population>0&&h.short>=1).sort((a,b)=>b.short-a.short||String(a.settlementId).localeCompare(String(b.settlementId)));for(const h of pressured){domestic(v,w,all,h);if(h.short<1)delete since[h.settlementId];}
 // Recompute after real domestic moves: no foreign migration while any safe domestic vacancy remains.
 const remaining=all.filter(h=>h.population>0&&h.short>=1);for(const h of remaining){if(now-N(since[h.settlementId]??now)<WAIT)continue;const potential=safeDestinations(v,w,h,all);if(potential.out.length)continue;foreignHousing(v,w,h,byNation);break;}
 }
 });}
const previousAdvance=NS.World.prototype.advanceOneDay,previousSocial=NS.World.prototype.socialAndMigration;
NS.World.prototype.advanceOneDay=function(...a){const r=previousAdvance.apply(this,a);month(this);return r;};
// Retain food-crisis threshold/chance. Unlike the old capital teleport, admission now requires real housing/food capacity.
NS.World.prototype.socialAndMigration=function(...a){for(const v of [...this.activeVillages||[]]){v.foodCrisisDays=N(v.foodCrisisDays);if(v.foodReserveDays()<7)v.foodCrisisDays++;else v.foodCrisisDays=Math.max(0,v.foodCrisisDays-2);if(v.foodCrisisDays<18)continue;const chance=Math.min(.022,Math.max(.006,.006+(v.foodCrisisDays-18)*.00035));if(Math.random()>=chance)continue;
 const movers=v.residents.filter(p=>p.alive&&p.age>=15&&p.assignment!=='PIONEER'&&p.militaryStatus32A!=='active'),targets=[...(this.activeVillages||[])].filter(t=>!eq(t.id,v.id)&&t.foodReserveDays()>42).sort((a,b)=>N(v.relations?.[b.id])-N(v.relations?.[a.id]));if(!movers.length||!targets.length)continue;const p=movers[Math.floor(Math.random()*movers.length)];let found=null;for(const t of targets){const suitable=rows(t,this).filter(h=>allowed(t,h)).sort((a,b)=>b.free-a.free||String(a.settlementId).localeCompare(String(b.settlementId)));if(suitable.length){found={t,h:suitable[0]};break;}}
 if(!found){stats(v).foodMigrationBlocked++;continue;}applyForeign(this,v,found.t,p,found.h,'FOOD');stats(v).foodMigrations++;}};
// Normal voluntary migration now uses the same Settlement-wide availability as urgent relocation.
// Keep the existing monthly entry point, conservative move count, inertia and real Gold transfer.
function normalMigration(v,w,all){if(v.population()<Math.max(8,v.territory.size+2)||all.length<2)return false;return routeContext(w,()=>{
 const now=cal(w),urban=NS.AIProfileCompat(v,'urbanConcentration')>.5,guard=Number(NS.V033F5A7?.migrationGuard?.(v)??(urban?720:900));
 const eligible=(v.residents||[]).filter(p=>eligiblePerson(p)&&now-N(p._v28LastUrbanMoveCalendar??-99999)>=guard&&N(w.ordinalDay?.())-N(p.lastMoveDay??-99999)>160).slice(0,48);
 const byTile=new Map();for(const h of all)for(const tid of h.tileIds)byTile.set(Number(tid),h);
 const appeal=h=>Math.min(16,h.free*2.4)+Math.min(12,Math.max(0,foodDays(v,h))*.23)+Math.min(11,Math.sqrt(h.population)*2.0);
 let best=null,distCache=new Map();for(const p of eligible){const src=byTile.get(Number(p.homeTileId));if(!src||src.population<=1)continue;
  for(const dest of all){if(eq(src.settlementId,dest.settlementId)||!allowed(v,dest)||!safeControl(w,dest))continue;
   const key=String(src.settlementId)+'>'+String(dest.settlementId);let d=distCache.get(key);if(d==null){d=ownedPath(w,src,dest,[v.id]);distCache.set(key,d);}if(!Number.isFinite(d))continue;
   const reverse=Number(p._v28PreviousHomeTileId)===Number(dest.home)&&now-N(p._v28LastUrbanMoveCalendar??0)<1080;
   const score=appeal(dest)-appeal(src)-Math.max(0,d-1)*.9-(reverse?10:0);
   if(!best||score>best.score)best={p,src,dest,score};}}
 if(!best||best.score<(urban?8.5:10.5)||Math.random()>.52)return false;
 applyHome(v,w,best.p,best.dest,'VOLUNTARY_SETTLEMENT_MOVE');return true;
 });}
NS.Village.prototype.internalMigration=function(w){const all=rows(this,w);if(all.some(h=>h.population>0&&h.short>=1))return false;return normalMigration(this,w,all);};
const serVillage=NS.Village.prototype.serialize,serWorld=NS.World.prototype.serialize,fromWorld=NS.World.from,personFrom=NS.Person.from,oldTele=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
NS.Village.prototype.serialize=function(...a){const d=serVillage.apply(this,a);d.v35g1bHousingSince=this.v35g1bHousingSince||{};d.v35g1bStats=this.v35g1bStats||{};d.v35g1bImmigrationAcceptance=this.v35g1bImmigrationAcceptance??1;return d;};
NS.Person.from=function(d,...a){const p=personFrom.call(this,d,...a);for(const k of ['_v35g1bResidenceSinceCal','_v35g1bResidenceSettlementId','_v35g1bLastForeignAttemptCal','_v35g1bNextForeignCal','_v35g1bLastForeignResult','_v35g1bApplicationOrigin'])if(Object.prototype.hasOwnProperty.call(d,k))p[k]=d[k];return p;};
NS.World.prototype.serialize=function(...a){const d=serWorld.apply(this,a);d.version=VERSION;d.v35g1bLastReview=N(this._v35g1bLastReview)||null;d.v35h0Routing={...routingStats(this)};return d;};
NS.World.from=function(d,...a){const current=d?.version===VERSION||d?.version==='V0.35G1B';const w=fromWorld.call(this,current?{...d,version:PREVIOUS}:d,...a);if(current){w._v35g1bLastReview=d.v35g1bLastReview||null;const rd=d.v35h0Routing;if(rd&&typeof rd==='object'){w._v35h0Routing={};for(const k of routeFields)w._v35h0Routing[k]=Number.isFinite(Number(rd[k]))?Number(rd[k]):0;}for(const x of d.villages||[]){const v=w.villages.find(v=>eq(v.id,x.id));if(v){v.v35g1bHousingSince=x.v35g1bHousingSince||{};v.v35g1bStats=x.v35g1bStats||{};v.v35g1bImmigrationAcceptance=x.v35g1bImmigrationAcceptance??1;}}}return w;};
function report(w){return {format:'vilob-v035g1b-housing-migration-v1',version:VERSION,calendarDay:cal(w),constants:{waitDays:WAIT,reviewDays:REVIEW,maxDomesticMoves:MAX_RESCUE,retryDays:RETRY,happinessPerApplication:HAPPINESS_PENALTY,immigrationAcceptanceDefault:1},nations:(w.activeVillages||[]).map(v=>({id:v.id,name:v.name,stats:{...stats(v)},acceptance:v.v35g1bImmigrationAcceptance??1,settlements:rows(v,w).map(h=>({id:h.settlementId,tiles:h.tileIds,population:h.population,capacity:h.capacity,shortage:h.short,vacancy:h.free,foodReserveDays:foodDays(v,h),shortageSince:v.v35g1bHousingSince?.[h.settlementId]??null}))}))};}
NS.Telemetry.prototype.toJSON=function(w,...a){const d=oldTele.call(this,w,...a);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v35g1bHousingMigration=report(w);d.worldSummary.v35h0Routing=routeReport(w);return d;};
function routeReport(w){const x=routingStats(w);return {version:VERSION,calendarDay:cal(w),profileEnabled:w._v35h0RouteProfile===true,...x,avoidedSearches:x.hits,cacheHitShare:x.queries?x.hits/x.queries:0,notes:'BFS scope is 30-day world housing review or voluntary nation migration; profile time OFF unless manually enabled.'};}
function download(name,body){if(typeof document==='undefined')return;const u=URL.createObjectURL(new Blob([body],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('로컬 저장 공간 부족: JSON으로 내보내세요. '+e.message);}},load(){const r=localStorage.getItem(KEY)||localStorage.getItem('village-observer-v035g1b')||localStorage.getItem('village-observer-v035g1a');return r?NS.World.from(JSON.parse(r)):oldSave.load?.();},export(w){download(`village-observer-v035H0-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){download(`village-observer-v035H0-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},export35G1BHousing(w){download(`vilob-v035H0-housing-migration-${w.year}y.json`,JSON.stringify(report(w),null,2));},export35H0Routing(w){download(`vilob-v035H0-route-performance-${w.year}y.json`,JSON.stringify(routeReport(w),null,2));}};
if(NS.UI){const head=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const r=head.apply(this,a);badge();return r;};const render=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...a){const r=render.apply(this,a);if(typeof document!=='undefined'){const panel=document.getElementById('v035gConstructionExports');if(panel&&!document.getElementById('v035g1bHousingExport')){const b=document.createElement('button');b.id='v035g1bHousingExport';b.textContent='35G1B 주거·이주 진단 JSON';b.addEventListener('click',()=>NS.SaveSystem.export35G1BHousing(this.world));panel.appendChild(b);}if(panel&&!document.getElementById('v035h0RoutingExport')){const b=document.createElement('button');b.id='v035h0RoutingExport';b.textContent='35H0 경로·성능 진단 JSON';b.addEventListener('click',()=>NS.SaveSystem.export35H0Routing(this.world));panel.appendChild(b);}if(panel&&!document.getElementById('v035h0RouteToggle')){const b=document.createElement('button');b.id='v035h0RouteToggle';b.textContent='35H0 경로 시간 계측: '+(this.world._v35h0RouteProfile?'ON':'OFF');b.addEventListener('click',()=>{this.world._v35h0RouteProfile=!this.world._v35h0RouteProfile;b.textContent='35H0 경로 시간 계측: '+(this.world._v35h0RouteProfile?'ON':'OFF');});panel.appendChild(b);}badge();}return r;};}
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.35G1B'))NS.PATCH_NOTES.unshift({version:'V0.35G1B',date:'2026-10-23',title:'Settlement Housing Migration V1',summary:'Settlement 공동 주거 부족 시 국내 빈집 활용을 우선하고, 장기 부족 825일 이후 접경국 2단계 해외 이주 신청과 거절·귀환·행복도 감소를 도입합니다.',sections:[['국내 주거 대응',['30일마다 실제 공동 주거 부족과 국내 타 Settlement의 주거·식량·경로를 확인해 최대 3명 재배치합니다.','공동 부족이 해소되면 해외 이주 대기 카운터가 초기화됩니다.']],['국제 이주',['초기 주택 기본 건설 시간 275일의 3배인 825일 지속 부족을 고정 기준으로 사용합니다.','국경을 공유하는 국가의 가장 가까운 Settlement에 먼저 신청하고, 거절 시 같은 국가의 다른 Settlement에 한 번 더 신청합니다.','각 신청마다 행복도가 3 감소하며, 두 번 거절되면 출신 Settlement에 남아 360일 후 재신청할 수 있습니다.','이민 수용 정책 기본 승인율 100%이며 실제 주거 공간과 식량 안전 조건을 별도로 검사합니다.']],['호환·보존',['G1A 세이브 가져오기와 G1B 독립 저장 키를 지원합니다.','기존 식량난 해외 이주는 조건과 확률을 유지하지만 도착지 실제 주거·식량 수용량을 검사합니다.','기본 건설 0.80/일, 건축가 ×3.0, 기술 43개, 전쟁·Gold·물자 회계는 변경하지 않습니다.']]]});
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Late-Game Simulation Performance V1 · H0',summary:'G1B 이주 경로의 반복 BFS를 한 번의 출발 Settlement 탐색 결과로 재사용하고 저비용 계측을 추가합니다. 이주·경제·건설·전쟁의 판단 규칙은 유지합니다.',sections:[['경로 최적화',['30일 국내 주거 재배치와 자발적 이주에서 출발 Settlement/국가 통행 허용 조건별 BFS 결과를 같은 판단 범위에서 재사용합니다.','목적지 점수·거리·동률 우선순위·통행 가능 조건·RNG 호출을 변경하지 않습니다.']],['성능 계측',['기본 ON 정수 카운터는 질의·BFS·재사용·방문 타일을 기록합니다. 시간 측정은 기본 OFF로 유지합니다.','세계 → 고급 도구 → 35H0 경로·성능 진단 JSON, Devlog worldSummary.v35h0Routing을 지원합니다.']],['보존·이관',['G1B 세이브를 H0 전용 키로 이관하고 예전 저장을 변경하지 않습니다.','G1A 건설력 0.80, 건축가 3배, 기술 43개, CSV 1683열과 보호 소스 169블록은 변경하지 않습니다.']]]});
const api=Object.freeze({version:VERSION,report,routeReport,month,rows,domestic,foreignHousing,selectForeign,admission,normalMigration,constants:{WAIT,REVIEW,MAX_RESCUE,RETRY,HAPPINESS_PENALTY},debug:{path,ownedPath,routeContext,applyHome}});NS.V035G1B=api;NS.V035H0=api;badge();
})(window.VSim);

;
/* H1B2 bundled source: v035h1a.js */
/* V0.35H1A — Repeatable performance worlds: fixed initial map + RNG, resumable
 * scenario checkpoints, and durable, low-frequency state signatures.
 * No changes to ordinary world's simulation RNG or gameplay balance.
 */
(function(NS){'use strict';
if(!NS?.World||!NS?.MapGenerator||!NS?.V035H0)return;
const VERSION='V0.35H1B1A',PREVIOUS_VERSION='V0.35H1B1',OLDER_VERSION='V0.35H1B',KEY='village-observer-v035h1b1a',PREVIOUS_KEY='village-observer-v035h1b1',OLDER_KEY='village-observer-v035h1b',FORMAT='village-observer-test-scenario';
const PERF_FORMAT='vilob-performance-anchor-v1',DEFAULT_SEED='perf-19x19-a-v1',YEARS=[20,30,40,60,75,90,100,120,150];
const oldAdvance=NS.World.prototype.advanceOneDay,oldSerialize=NS.World.prototype.serialize,oldFrom=NS.World.from,oldToJSON=NS.Telemetry.prototype.toJSON,oldSave=NS.SaveSystem;
const copy=x=>JSON.parse(JSON.stringify(x));
const cal=w=>Number(w.calendarOrdinalDay?.()??0);
const hashSeed=s=>{let h=2166136261>>>0;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const next=s=>{let x=(s>>>0)||0x6d2b79f5;x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;};
function withRng(ref,fn){const prev=Math.random;Math.random=()=>{ref.state=next(ref.state);return ref.state/4294967296;};try{return fn();}finally{Math.random=prev;}}
function validState(x){return Number.isInteger(x)&&x>=0&&x<=4294967295;}
function ensure(w,src=null){if(!w)return null;if(src?.v35h1a&&w.v35h1a==null)w.v35h1a=copy(src.v35h1a);const d=w.v35h1a;if(!d)return null;if(!d.enabled||!validState(d.rngState)||typeof d.seed!=='string'||!d.seed)throw new Error('H1A 결정론 RNG/시드가 올바르지 않습니다.');d.checkpoints=d.checkpoints||{};return d;}
function fingerprint(w){
 // Simulation state signature, explicitly excludes rendering, telemetry, profiler,
 // diagnostic caches, and wall-clock time. A compact diagnostic, not a full proof of parity.
 const string=JSON.stringify({date:[w.year,w.season,w.day],map:(w.map?.tiles||[]).map(t=>[t.id,t.ownerId,t.v33OccupierId||null,t.terrain,t.road,t.resources,t.buildings]),nations:(w.villages||[]).map(v=>[v.id,v.status,v.coreTileId,[...(v.territory||[])].sort((a,b)=>a-b),v.gold,v.technologies?[...v.technologies].sort():[],(v.residents||[]).map(p=>[p.id,p.alive,p.age,p.health,p.hunger,p.happiness,p.homeTileId,p.workTileId,p.job,p.assignment,p.gold29,p.militaryStatus32A]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))]),rng:w.v35h1a?.rngState});
 let a=2166136261>>>0,b=0x9e3779b9;for(let i=0;i<string.length;i++){const c=string.charCodeAt(i);a=Math.imul(a^c,16777619)>>>0;b=(Math.imul(b^c,2246822519)+3266489917)>>>0;}return [a,b].map(x=>x.toString(16).padStart(8,'0')).join('');
}
function measure(w){return {year:Number(w.year),calendarDay:cal(w),population:(w.activeVillages||[]).reduce((n,v)=>n+(v.residents||[]).filter(p=>p.alive!==false).length,0),activeNations:(w.activeVillages||[]).length,claimedTiles:(w.map?.tiles||[]).filter(t=>t.ownerId!=null).length,settlements:Number(NS.V034B?.summary?.(w)?.activeSettlements??0)||undefined,rngState:w.v35h1a?.rngState??null,signature:fingerprint(w)};}
function checkpoint(w,label,save=true){const d=ensure(w);if(!d)throw Error('고정 성능 시나리오가 아닙니다.');const c={label:String(label),...measure(w)};if(save)d.checkpoints[String(label)]=c;return c;}
NS.World.prototype.advanceOneDay=function(...args){const d=ensure(this);if(!d)return oldAdvance.apply(this,args);const ref={state:d.rngState>>>0};const result=withRng(ref,()=>oldAdvance.apply(this,args));d.rngState=ref.state>>>0;
 for(const y of YEARS){if(this.year>=y&&!d.checkpoints[String(y)])checkpoint(this,String(y));}
 return result;};
function createWorld(seed=DEFAULT_SEED){seed=String(seed||DEFAULT_SEED).trim();if(!/^[a-zA-Z0-9_-]{3,72}$/.test(seed))throw Error('성능 시드는 영문·숫자·하이픈·밑줄 3~72자로 입력하세요.');
 const ref={state:hashSeed(seed+'|h1a-init')||1};let w=withRng(ref,()=>{
  const map=Object.create(NS.TileMap.prototype);Object.assign(map,{width:19,height:19,tiles:[],ruinIds:new Set()});NS.MapGenerator.naturalGenerate(map,seed);map.generationSeed=seed;
  const o=Object.create(NS.World.prototype);Object.assign(o,{year:1,season:0,day:1,speed:1,running:false,eventCount:0,events:[],map,villages:[],selectedVillageId:null,selectedPersonId:null,selectedTileId:null,telemetry:new NS.Telemetry(),anomalyStates:{},recentTrades:[],tradeRouteCache:{},mapSource:{type:'natural',name:'H1A Performance Anchor',seed}});
  o.createVillages(7);o.telemetry.snapshot(o,'WORLD_START');return NS.V033G2B?.attachWorld?.(o)||o;
 });
 // G3's AI anchor experiment must remain OFF, with all seven baseline nations.
 if(w.v33g3)w.v33g3.experiment=null;
 w.v35h1a={enabled:true,format:PERF_FORMAT,seed,rngAlgorithm:'xorshift32',rngState:ref.state>>>0,checkpoints:{},initialProfiles:(w.villages||[]).map(v=>({id:v.id,profileId:v.aiProfileId||v.brain?.aiProfileId||null}))};
 w.testScenario={id:'h1a-'+seed,title:'H1A 성능 기준 · '+seed,purpose:'19×19 기본 7개국 고정 자연주행 성능/결정론 비교',expected:'동일 버전에서 동일 시드 및 동일 체크포인트 상태를 재현',category:'performance',intendedVersion:VERSION,tags:['H1A','performance','fixed-rng',seed]};w._v32e11Scenario={...w.testScenario};
 checkpoint(w,'INITIAL');return w;
}
NS.World.prototype.serialize=function(...args){const d=oldSerialize.apply(this,args);d.version=VERSION;if(this.v35h1a)d.v35h1a=copy(this.v35h1a);return d;};
NS.World.from=function(data,...args){const current=data?.version===VERSION||data?.version===PREVIOUS_VERSION||data?.version===OLDER_VERSION||data?.version==='V0.35H1A'||data?.version==='V0.35H1A-HF';const d=current?{...copy(data),version:'V0.35H0'}:data;const w=oldFrom.call(this,d,...args);if(data?.v35h1a){w.v35h1a=copy(data.v35h1a);ensure(w);
 // Some legacy attachWorld readers rewrite fiscal and seasonal state at load time.
 // The actual checkpoint values must remain authoritative for repeatable future pulses.
 // Restore serialized canonical fiscal/admin/intelligence timing, which some older
 // import wrappers refresh merely while attaching the world.
 for(const k of ['v30','v33d1a','v33e','v33e1','v33e2','v33f5','v33f5a7','v33g1'])if(Object.prototype.hasOwnProperty.call(data,k))w[k]=copy(data[k]);
 for(const tile of data.map?.tiles||[]){const t=w.map?.get?.(Number(tile.id));if(t&&Object.prototype.hasOwnProperty.call(tile,'v29Economy'))t.v29Economy=copy(tile.v29Economy);}
 for(const src of data.villages||[]){const v=(w.villages||[]).find(x=>String(x.id)===String(src.id));if(!v)continue;
  for(const k of ['lastExpansionClaimDay','v32dMilitary','v32dAdmin','v32d3Housing','v32d3Expansion','v32d4'])if(Object.prototype.hasOwnProperty.call(src,k))v[k]=copy(src[k]);
  for(const saved of src.residents||[]){const p=(v.residents||[]).find(q=>String(q.id)===String(saved.id));if(p&&!Object.prototype.hasOwnProperty.call(saved,'_v27NextJobReviewDay'))delete p._v27NextJobReviewDay;}
 } }return w;};
function report(w){const d=ensure(w);return {format:PERF_FORMAT,version:VERSION,mode:d?'FIXED_RNG':'NORMAL',seed:d?.seed||null,calendarDay:cal(w),rngState:d?.rngState??null,signature:d?fingerprint(w):null,checkpoints:d?copy(d.checkpoints):{},current:d?measure(w):null,profilers:{routeTime:w._v35h0RouteProfile===true,sim35A:w._v35aProfilerEnabled===true},guidance:'State signature excludes telemetry and runtime performance counters. Compare the same calendar date, RNG state and complete game state in addition to this signature. Timing comparison requires same input save, device and profiler OFF.'};}
NS.Telemetry.prototype.toJSON=function(w,...args){const d=oldToJSON.call(this,w,...args);d.version=VERSION;d.worldSummary=d.worldSummary||{};d.worldSummary.v35h1aPerformance=report(w);return d;};
function download(name,text){if(typeof document==='undefined')return;const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function scenario(w){const d=ensure(w);if(!d)throw Error('고정 성능 세계에서만 체크포인트를 내보낼 수 있습니다.');const s=w.serialize(),meta={...w.testScenario,checkpointCalendarDay:cal(w),checkpointYear:Number(w.year),seed:d.seed};s.testScenario={...meta};if(s.v32e11)s.v32e11.scenario={...meta};return {format:FORMAT,version:1,validationVersion:'1.1',meta,world:s,perf:{format:PERF_FORMAT,stateSignature:fingerprint(w),rngState:d.rngState,seed:d.seed}};}
async function importCheckpoint(file){const text=typeof file==='string'?file:await file.text(),o=JSON.parse(text);if(o?.format!==FORMAT||o?.perf?.format!==PERF_FORMAT||![VERSION,PREVIOUS_VERSION,OLDER_VERSION,'V0.35H1A'].includes(o?.world?.version)&&o?.world?.version!=='V0.35H1A-HF'||o?.meta?.category!=='performance')throw Error('H1A 성능 체크포인트 시나리오가 아닙니다.');const d=o.world.v35h1a;if(!d?.enabled||d.seed!==o.perf.seed||d.rngState!==o.perf.rngState||!validState(d.rngState))throw Error('체크포인트 RNG/시드 검증 실패');
 // Validate the exact restored simulation state before any telemetry/import side effects.
 const w=NS.World.from(o.world);ensure(w);if(NS.V035H1B1)NS.V035H1B1.reconcile(w,o);else if(fingerprint(w)!==o.perf.stateSignature)throw Error('체크포인트 세계 상태 서명이 일치하지 않습니다.');
 NS.V032E12?.validateRuntime?.(w,o.meta);
 return w;}
NS.SaveSystem={...oldSave,save(w){try{localStorage.setItem(KEY,JSON.stringify(w.serialize()));}catch(e){throw Error('저장 공간 부족. 전체 체크포인트 JSON으로 내보내세요: '+e.message);}},load(){const x=localStorage.getItem(KEY)||localStorage.getItem(PREVIOUS_KEY)||localStorage.getItem(OLDER_KEY)||localStorage.getItem('village-observer-v035h1a-hf')||localStorage.getItem('village-observer-v035h1a');return x?NS.World.from(JSON.parse(x)):oldSave.load?.();},export(w){download(`village-observer-v035H1B1-save-${w.year}y.json`,JSON.stringify(w.serialize()));},exportDevJSON(w){download(`village-observer-v035H1B1-devlog-${w.telemetry.sessionId}.json`,JSON.stringify(w.telemetry.toJSON(w)));},exportH1APerf(w){download(`vilob-v035H1B1-performance-${w.year}y.json`,JSON.stringify(report(w),null,2));},exportH1ACheckpoint(w){const x=scenario(w);download(`vilob-PERF-${x.perf.seed}-${cal(w)}d-checkpoint.json`,JSON.stringify(x));return x;},importH1ACheckpoint:importCheckpoint};
function uiInstall(ui){if(typeof document==='undefined')return;const host=document.getElementById('v035gConstructionExports')||document.getElementById('view-world');if(!host)return;let box=document.getElementById('v035h1aPanel');if(!box){box=document.createElement('div');box.id='v035h1aPanel';box.className='panel';box.innerHTML='<h3>H1B1A · 고정 성능 시나리오</h3><div class="small muted">19×19 · 기본 7개국 · 맵 시드/RNG 고정. 시나리오 체크포인트에서 같은 상태로 재시작합니다.</div><div class="button-grid"><button id="v035h1aStart">고정 시나리오 시작</button><button id="v035h1aCheckpoint">현재 체크포인트 JSON</button><label class="file-btn">체크포인트 불러오기<input id="v035h1aImport" type="file" accept=".json,application/json"></label><button id="v035h1aReport">성능·상태 요약 JSON</button><button id="v035h1b1CheckpointDiag">체크포인트 진단 JSON</button></div><div id="v035h1aStatus" class="small muted"></div>';host.appendChild(box);const q=id=>document.getElementById(id);q('v035h1aStart').onclick=()=>{if(!confirm('현재 세계를 종료하고 표준 PERF-19X19-A 고정 시나리오를 시작할까요?'))return;try{const w=createWorld();ui.setWorld(w);ui.render?.();uiInstall(ui);}catch(e){q('v035h1aStatus').textContent='시작 실패: '+e.message;}};q('v035h1aCheckpoint').onclick=()=>{try{NS.SaveSystem.exportH1ACheckpoint(ui.world);q('v035h1aStatus').textContent='체크포인트 내보내기 완료';}catch(e){q('v035h1aStatus').textContent=e.message;}};q('v035h1aImport').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!confirm('현재 세계를 종료하고 이 H1A 성능 체크포인트를 불러올까요?'))return;const w=await importCheckpoint(f);ui.setWorld(w);ui.render?.();uiInstall(ui);}catch(ex){q('v035h1aStatus').textContent='체크포인트 오류: '+ex.message;}finally{e.target.value='';}};q('v035h1aReport').onclick=()=>NS.SaveSystem.exportH1APerf(ui.world);q('v035h1b1CheckpointDiag').onclick=()=>{try{NS.V035H1B1.downloadDiagnostic();}catch(e){q('v035h1aStatus').textContent=e.message;}};}
 const d=ui?.world?.v35h1a,st=document.getElementById('v035h1aStatus');if(st)st.textContent=d?.enabled?`고정 모드 ON · ${d.seed} · ${ui.world.year}년 · RNG ${d.rngState} · 요약 체크포인트 ${Object.keys(d.checkpoints||{}).join(', ')}`:'일반 세계 · 고정 성능 모드 비활성';}
if(NS.UI){const prevRender=NS.UI.prototype.renderWorld,prevHeader=NS.UI.prototype.renderHeader,prevAll=NS.UI.prototype.render,prevViews=NS.UI.prototype.renderViews;NS.UI.prototype.renderWorld=function(...args){const r=prevRender.apply(this,args);uiInstall(this);return r;};/* H1B2: redundant version-only UI wrapper omitted *//* H1B2: redundant version-only UI wrapper omitted *//* H1B2: redundant version-only UI wrapper omitted */}
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version==='V0.35H1A-HF'))NS.PATCH_NOTES.unshift({version:'V0.35H1A-HF',date:'2026-10-23',title:'Release Cleanup & CI Hotfix · H1A-HF',summary:'H1A 고정 성능 시나리오 및 게임 규칙을 유지하고, GitHub Pages 자동 테스트와 배포 패키지의 중복 파일을 정리합니다.',sections:[['고정 자연주행',['표준 PERF-19X19-A로 지도 시드와 초기/진행 난수 상태를 고정합니다.','기존 G3 AI Anchor Profile을 적용하지 않고 기본 7개 국가 구성을 사용합니다.']],['체크포인트',['20·30·40·60·75·90·100·120·150년 진입 시 가벼운 상태 서명만 자동 기록합니다.','전체 세계를 재시작할 체크포인트 JSON은 사용자가 세계 탭에서 내보내며, 불러오기 시 RNG·시드·상태 서명을 확인합니다.']],['성능 정책',['실행시간 계측은 기본 OFF이고 계측 JSON은 시나리오 세계 상태와 구분합니다.','기존 H0 BFS 최적화, 건설·경제·군사·주거·기술 43개, CSV 1683열을 보존합니다.']]]});
NS.V035H1A=Object.freeze({version:VERSION,seed:DEFAULT_SEED,createWorld,checkpoint,report,scenario,importCheckpoint,fingerprint,ensure,withRng});badge();
})(window.VSim);

;
/* H1B2 bundled source: v035h1b.js */
/* Village Observer V0.35H1B — isolated, optional hotpath attribution.
 * No profiler instruments an unselected world.  Never serialize runtime timers.
 * Timers are inclusive and are not safe to add across nested systems.
 */
(function(NS){'use strict';
if(!NS?.V035H1A||!NS?.V035A||!NS?.V035C||!NS?.V035D)return;
const VERSION='V0.35H1B1';
const clock=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
const ranks=a=>{const b=a.slice().sort((x,y)=>x-y),at=p=>b.length?b[Math.min(b.length-1,Math.ceil(b.length*p)-1)]:0;return {samples:b.length,meanMs:b.length?a.reduce((x,y)=>x+y,0)/b.length:0,medianMs:at(.5),p95Ms:at(.95),maxMs:b.length?b[b.length-1]:0};};
let active=null,latest=null;
const catalog={BASELINE:{label:'계측 OFF 기준 측정',maxDays:180},A:{label:'35A 일일·Person',maxDays:180},C:{label:'35C 분기·행정',maxDays:360},D:{label:'35D 사회·경제',maxDays:360}};
function runtimeSnapshot(s){
 const a=NS.V035H1A,days=s.latencies.length,batches=s.batches.slice(),stat=ranks(s.latencies),batch=ranks(batches),world=s.world;
 const profiler=s.mode==='A'?NS.V035A.report():s.mode==='C'?NS.V035C.report():s.mode==='D'?NS.V035D.report():null;
 return {format:'vilob-v035h1b-attribution-v1',version:VERSION,mode:s.mode,modeLabel:catalog[s.mode].label,active:s.active,start:s.start,finish:s.active?null:{...a.report(world).current},observedDays:days,plannedDays:catalog[s.mode].maxDays,
  simDays:stat,nonoverlap10DayBatches:batch,over1000Ms:batches.filter(x=>x>1000).length,snapshotInclusive:{calls:s.snapshotCalls,ms:s.snapshotMs,maxMs:s.snapshotMax,meanMs:s.snapshotCalls?s.snapshotMs/s.snapshotCalls:0},
  profiler:profiler||null,
  interpretation:{profilerOverhead:s.mode!=='BASELINE',baselineOverhead:'Only 2 high-resolution clock reads per day plus one report row; not identical to entirely instrument-free F0',batch:'10 consecutive measured advanceOneDay costs, no rendering/yield; not the browser UI F0 batch metric',snapshot:'Snapshot time includes every nested legacy observation layer; overlaps with World.advanceOneDay, do not add',crossMode:'Each mode must start by loading the same whole-world checkpoint file. Compare same device and world/state signature. Profilers 35A, 35C, 35D are mutually exclusive.',regression:'Signature and RNG are necessary checks, not a substitute for complete-world parity or conserved-resource audits.'}};
}
function start(w,mode='BASELINE'){
 if(!catalog[mode])throw Error('H1B 계측 방식이 잘못됐습니다.');if(!w)throw Error('계측할 세계가 없습니다.');if(NS.V035H1B1?.snapshotReport?.()?.active)throw Error('H1B1 스냅샷 진단을 먼저 종료하세요.');if(active)stop();
 if(NS.V035A.isActive()||NS.V035C.isActive()||NS.V035D.isActive()||NS.V035B?.reportDetail?.()?.active)throw Error('다른 프로파일러를 종료한 뒤 H1B를 시작하세요.');
 const startState=NS.V035H1A.report(w);if(startState.mode!=='FIXED_RNG')throw Error('H1B는 고정 RNG 시나리오 또는 그 체크포인트에서만 실행할 수 있습니다.');
 const s={world:w,mode,active:true,start:{...startState.current},latencies:[],batches:[],batchSum:0,partial:0,snapshotCalls:0,snapshotMs:0,snapshotMax:0,restores:[],profilerStarted:false};
 const api=mode==='A'?NS.V035A:mode==='C'?NS.V035C:mode==='D'?NS.V035D:null;
 try{
  if(api){api.start(w);s.profilerStarted=true;}
  const old=NS.World.prototype.advanceOneDay;
  const wrapper=function(...args){if(this!==w)return old.apply(this,args);const t=clock();try{return old.apply(this,args);}finally{
   const elapsed=Math.max(0,clock()-t);s.latencies.push(elapsed);s.partial++;s.batchSum+=elapsed;
   if(s.partial===10){s.batches.push(s.batchSum);s.partial=0;s.batchSum=0;}
   if(s.active&&s.latencies.length>=catalog[s.mode].maxDays)stop();
  }};
  NS.World.prototype.advanceOneDay=wrapper;s.restores.push([NS.World.prototype,'advanceOneDay',old,wrapper]);
  if(mode!=='BASELINE'){
   const prev=NS.Telemetry.prototype.snapshot;
   const wrapperSnap=function(...args){if(args[0]!==w)return prev.apply(this,args);const t=clock();try{return prev.apply(this,args);}finally{const elapsed=Math.max(0,clock()-t);s.snapshotCalls++;s.snapshotMs+=elapsed;s.snapshotMax=Math.max(s.snapshotMax,elapsed);}};
   NS.Telemetry.prototype.snapshot=wrapperSnap;s.restores.push([NS.Telemetry.prototype,'snapshot',prev,wrapperSnap]);
  }
 }catch(e){for(const [owner,key,old,wrapped] of s.restores.reverse())if(owner[key]===wrapped)owner[key]=old;if(s.profilerStarted)api?.stop();throw e;}
 active=s;return runtimeSnapshot(s);
}
function stop(){if(!active)return latest;const s=active;s.active=false;
 for(const [owner,key,original,wrapper] of s.restores.slice().reverse())if(owner[key]===wrapper)owner[key]=original;
 if(s.profilerStarted)(s.mode==='A'?NS.V035A:s.mode==='C'?NS.V035C:NS.V035D).stop();
 latest=runtimeSnapshot(s);active=null;return latest;
}
function report(){return active?runtimeSnapshot(active):latest;}
function download(name,object){if(typeof document==='undefined')return object;const blob=new Blob([JSON.stringify(object,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);return object;}
const prevSave=NS.SaveSystem,priorDev=NS.Telemetry.prototype.toJSON;
NS.SaveSystem={...prevSave,exportH1BProfile(w){const r=report();if(!r)throw Error('H1B 진단 시작 후 저장하세요.');return download(`vilob-v035H1B-${r.mode}-${w.year}y-diagnostic.json`,r);}};
NS.Telemetry.prototype.toJSON=function(w,...args){const d=priorDev.call(this,w,...args);d.version=VERSION;if(report()&&active?.world===w){d.worldSummary=d.worldSummary||{};d.worldSummary.v35h1bDiagnostic={mode:active.mode,days:active.latencies.length};}return d;};
function panel(ui){if(typeof document==='undefined'||!ui?.world)return;const host=document.getElementById('v035h1aPanel')||document.getElementById('v035gConstructionExports');if(!host)return;let box=document.getElementById('v035h1bPanel');if(!box){box=document.createElement('div');box.id='v035h1bPanel';box.className='panel';box.style.marginTop='10px';box.innerHTML='<h3>H1B · 성능 진단 세션</h3><div class="small muted">매 단계 시작 전에 위의 「체크포인트 불러오기」로 <b>동일한 체크포인트 파일</b>을 다시 여세요. 계측기는 중복 실행하지 않습니다.</div><div class="button-grid"><button type="button" data-h1b="BASELINE">기준 180일</button><button type="button" data-h1b="A">35A 180일</button><button type="button" data-h1b="C">35C 360일</button><button type="button" data-h1b="D">35D 360일</button><button type="button" id="v035h1bStop">진단 종료</button><button type="button" id="v035h1bExport">H1B 진단 JSON</button></div><div id="v035h1bStatus" class="small muted"></div>';host.appendChild(box);
  for(const b of box.querySelectorAll('[data-h1b]'))b.addEventListener('click',()=>{try{start(ui.world,b.dataset.h1b);panel(ui);}catch(e){const p=document.getElementById('v035h1bStatus');if(p)p.textContent=String(e?.message||e);}});
  box.querySelector('#v035h1bStop').onclick=()=>{stop();panel(ui);};box.querySelector('#v035h1bExport').onclick=()=>{try{NS.SaveSystem.exportH1BProfile(ui.world);}catch(e){const st=document.getElementById('v035h1bStatus');if(st)st.textContent=e.message;}};
 }
 const r=report(),status=document.getElementById('v035h1bStatus');if(status)status.textContent=r?`${r.modeLabel} · ${r.observedDays}/${r.plannedDays}일 · 10일 배치 중앙값 ${r.nonoverlap10DayBatches.medianMs.toFixed(1)}ms · ${r.active?'계측 중':'종료'} · 계측값은 실제 ×10 UI 성능과 구분`:'진단 없음 · 고정 성능 세계 체크포인트를 불러오세요.';
}
if(NS.UI){const oldRender=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...args){const r=oldRender.apply(this,args);panel(this);return r;};const oldSet=NS.UI.prototype.setWorld;NS.UI.prototype.setWorld=function(w,...args){if(active&&active.world!==w)stop();return oldSet.call(this,w,...args);};}
function badge(){if(typeof document==='undefined')return;document.title='Village Observer '+VERSION;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}}
/* H1B2: redundant version-only UI wrapper omitted */
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Hotpath Attribution & Optimization V1 · H1B',summary:'같은 H1A 체크포인트 기반 35A·35C·35D 개별 진단과 일일 주민 현황 이중 순회 최적화. 시뮬레이션 규칙·난수 불변.',sections:[['병목 식별',['분리된 180/360일 진단 세션에서 일일 전체 및 Telemetry 스냅샷 inclusive 비용을 관측합니다.','35A·35C·35D 중첩 시간을 합산하지 않고, 계측 OFF와 정확한 브라우저 F0 측정을 구분합니다.']],['일일 핫패스',['보호 레거시 원본 SHA는 그대로 두고 Village.dailyTick의 근로자/상인 이중 filter 순회를 단일 순회로 변환합니다.','주민 행동 이후 조건식과 Gold 계산 순서 및 RNG 호출을 그대로 유지합니다.']],['검증',['H1A-HF 체크포인트 및 저장 키를 받아들이고 고정 RNG 시나리오를 유지합니다.','기술 43개, CSV 1683열, 169 보호 블록, 경량 GitHub 배포를 유지합니다.']]]});
NS.V035H1B=Object.freeze({version:VERSION,start,stop,report,isActive:()=>!!active,catalog:{...catalog}});badge();
})(window.VSim);

;
/* H1B2 bundled source: v035h1b1.js */
/* V0.35H1B1 — exact-signature checkpoint reconciliation and opt-in snapshot diagnostics.
 * Strictly repair only direct, serialized fingerprint fields; never fabricate people,
 * territories, or entities. No gameplay calls, no RNG, and no automatic snapshot writes.
 */
(function(NS){'use strict';
if(!NS?.V035H1A||!NS?.V035H1B)return;
const VERSION='V0.35H1B1', fp=NS.V035H1A.fingerprint;
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const clone=x=>JSON.parse(JSON.stringify(x));
const EQUAL=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const scalarTile=['ownerId','v33OccupierId','terrain','road','resources','buildings'];
const scalarNation=['status','coreTileId','gold'];
const scalarPerson=['alive','age','health','hunger','happiness','homeTileId','workTileId','job','assignment','gold29','militaryStatus32A'];
let last=null, snapshotActive=null, snapshotScope=null, completedSnapshot=null;
// Read-only lookups are reused only within one snapshot invocation. Never use across days.
function lookupVillage(w,id){if(!snapshotScope||snapshotScope.world!==w)return (w.villages||[]).find(x=>Number(x.id)===Number(id));
 const scope=snapshotScope;if(scope.rows!==w.villages||scope.length!==w.villages.length){scope.rows=w.villages;scope.length=w.villages.length;scope.byId=new Map();for(const v of w.villages){const k=Number(v.id);if(!scope.byId.has(k))scope.byId.set(k,v);}}
 return scope.byId.get(Number(id))||null;}
function brief(x){let s;try{s=JSON.stringify(x)}catch{s=String(x)}return s?.length>180?s.slice(0,180)+'…':s??'[undefined]';}
function prepare(raw,restored,expected){
 const diag={format:'vilob-v035h1b1-checkpoint-diagnostic-v1',version:VERSION,date:[raw.year,raw.season,raw.day],originalSignature:expected,serializedSignature:fp(raw),restoredSignature:fp(restored),result:'UNKNOWN',differences:[],differenceCount:0,repairCount:0,missingEntities:0};
 const diff=(path,a,b)=>{diag.differenceCount++;if(diag.differences.length<48)diag.differences.push({path,serialized:brief(a),restored:brief(b)});};
 const mapBy=(arr)=>new Map((arr||[]).map(x=>[String(x.id),x]));
 const tileMap=mapBy(restored.map?.tiles),nationMap=mapBy(restored.villages);
 for(const a of raw.map?.tiles||[]){const b=tileMap.get(String(a.id));if(!b){diag.missingEntities++;diff('map.tiles['+a.id+']','PRESENT','MISSING');continue;}
  for(const k of scalarTile)if(!EQUAL(a[k],b[k]))diff('map.tiles['+a.id+'].'+k,a[k],b[k]);
 }
 for(const a of raw.villages||[]){const b=nationMap.get(String(a.id));if(!b){diag.missingEntities++;diff('villages['+a.id+']','PRESENT','MISSING');continue;}
  for(const k of scalarNation)if(!EQUAL(a[k],b[k]))diff('villages['+a.id+'].'+k,a[k],b[k]);
  const ta=[...(a.territory||[])].sort((x,y)=>x-y),tb=[...(b.territory||[])].sort((x,y)=>x-y);
  if(!EQUAL(ta,tb))diff('villages['+a.id+'].territory',ta,tb);
  const sa=[...(a.technologies||[])].sort(),sb=[...(b.technologies||[])].sort();if(!EQUAL(sa,sb))diff('villages['+a.id+'].technologies',sa,sb);
  const ps=mapBy(b.residents);for(const p of a.residents||[]){const q=ps.get(String(p.id));if(!q){diag.missingEntities++;diff('villages['+a.id+'].residents['+p.id+']','PRESENT','MISSING');continue;}
   for(const k of scalarPerson)if(!EQUAL(p[k],q[k]))diff('villages['+a.id+'].residents['+p.id+'].'+k,p[k],q[k]);
  }
  if((b.residents||[]).length!==(a.residents||[]).length){diag.missingEntities++;diff('villages['+a.id+'].residents.length',(a.residents||[]).length,(b.residents||[]).length);}
 }
 if((restored.map?.tiles||[]).length!==(raw.map?.tiles||[]).length)diag.missingEntities++;
 if((restored.villages||[]).length!==(raw.villages||[]).length)diag.missingEntities++;
 return diag;
}
function setExact(o,k,value){if(value===undefined){if(Object.prototype.hasOwnProperty.call(o,k)){delete o[k];return 1;}return 0;}
 if(EQUAL(o[k],value))return 0;o[k]=clone(value);return 1;
}
function reconcile(w,wrapper){const raw=wrapper.world,expected=wrapper.perf.stateSignature;
 const diag=prepare(raw,w,expected);last=diag;
 if(diag.serializedSignature!==expected){diag.result='CORRUPT_OR_UNREPRESENTABLE_SERIALIZATION';throw new Error('저장된 원본 세계의 서명이 일치하지 않습니다. H1B1 체크포인트 진단 JSON을 내보내세요.');}
 if(diag.restoredSignature===expected){diag.result='EXACT';return w;}
 if(diag.missingEntities){diag.result='MISSING_ENTITIES';throw new Error('복원 과정에서 개체가 누락되거나 증가했습니다. 원본 파일은 변경하지 않았습니다. 진단 JSON을 내보내세요.');}
 // The exporter signature verified the canonical values. A few inherited attachWorld
 // adapters normalize even same-version fields on import; replay ONLY those stored
 // properties, preserving Set identity and all non-signature state. No AI tick runs.
 const byId=arr=>new Map((arr||[]).map(x=>[String(x.id),x]));
 const ts=byId(w.map?.tiles),vs=byId(w.villages);
 for(const a of raw.map?.tiles||[]){const b=ts.get(String(a.id));for(const k of scalarTile)diag.repairCount+=setExact(b,k,a[k]);}
 for(const a of raw.villages||[]){const b=vs.get(String(a.id));for(const k of scalarNation)diag.repairCount+=setExact(b,k,a[k]);
  if(!EQUAL([...(b.territory||[])].sort((x,y)=>x-y),[...(a.territory||[])].sort((x,y)=>x-y))){b.territory=new Set(a.territory||[]);diag.repairCount++;}
  if(!EQUAL([...(b.technologies||[])].sort(),[...(a.technologies||[])].sort())){b.technologies=new Set(a.technologies||[]);diag.repairCount++;}
  const ps=byId(b.residents);for(const p of a.residents||[]){const q=ps.get(String(p.id));for(const k of scalarPerson)diag.repairCount+=setExact(q,k,p[k]);}
 }
 diag.afterReconcileSignature=fp(w);
 if(diag.afterReconcileSignature!==expected){diag.result='UNRESOLVED';throw new Error('직렬화 복원 후 서명 불일치가 남았습니다. 진단 JSON을 내보내세요.');}
 diag.result='RECONCILED_CANONICAL_FIELDS';return w;
}
function recentDiagnostic(){return last?clone(last):null;}
function downloadDiagnostic(){if(!last)throw Error('체크포인트 검증 기록이 없습니다.');const result=clone(last);
 if(typeof document!=='undefined'){
  const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`vilob-v035H1B1-checkpoint-${result.date?.[0]||'unknown'}y-diagnostic.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }return result;
}
// Snapshot V1: compare opt-in observation runs without retaining large snapshots.
// This is an inclusive runtime metric, not a replacement for the existing 35A etc.
function startSnapshot(w){if(!w)throw Error('세계가 없습니다.');if(NS.V035H1B.isActive())throw Error('기존 H1B 진단을 먼저 종료하세요.');if(snapshotActive)stopSnapshot();
 const prev=NS.Telemetry.prototype.snapshot;const s={world:w,active:true,days:0,maxDays:180,startedAt:{year:w.year,day:w.day,rngState:w.v35h1a?.rngState,signature:fp(w)},calls:0,totalMs:0,maxMs:0,byReason:{},byStage:{},stack:[],previous:prev,wrapper:null,dayWrapper:null,previousDay:null};
 const wrapped=function(...args){if(args[0]!==w)return prev.apply(this,args);const start=clock();try{return prev.apply(this,args);}finally{const elapsed=Math.max(0,clock()-start),r=String(args[1]||'AUTO');s.calls++;s.totalMs+=elapsed;s.maxMs=Math.max(s.maxMs,elapsed);const a=s.byReason[r]||(s.byReason[r]={calls:0,ms:0});a.calls++;a.ms+=elapsed;}};
 s.wrapper=wrapped;NS.Telemetry.prototype.snapshot=wrapped;
 const originalDay=NS.World.prototype.advanceOneDay;
 const dayWrapper=function(...args){if(this!==w)return originalDay.apply(this,args);try{return originalDay.apply(this,args);}finally{s.days++;if(s.active&&s.days>=s.maxDays)stopSnapshot();}};
 s.dayWrapper=dayWrapper;s.previousDay=originalDay;NS.World.prototype.advanceOneDay=dayWrapper;snapshotActive=s;completedSnapshot=null;return snapshotReport();
}
function stopSnapshot(){
 if(!snapshotActive)return completedSnapshot;
 const s=snapshotActive;
 if(NS.Telemetry.prototype.snapshot===s.wrapper)NS.Telemetry.prototype.snapshot=s.previous;
 if(NS.World.prototype.advanceOneDay===s.dayWrapper)NS.World.prototype.advanceOneDay=s.previousDay;
 s.active=false;snapshotActive=null;
 completedSnapshot={format:'vilob-v035h1b1-snapshot-v1',version:VERSION,observedDays:s.days,plannedDays:s.maxDays,start:s.startedAt,finish:{year:s.world.year,day:s.world.day,rngState:s.world.v35h1a?.rngState,signature:fp(s.world)},calls:s.calls,totalMs:s.totalMs,maxMs:s.maxMs,meanMs:s.calls?s.totalMs/s.calls:0,byReason:clone(s.byReason),segments:clone(s.byStage),segmentNote:'Selected nested snapshot boundaries; exclusiveMs subtracts only measured descendants. This estimate is separate from 35A/C/D inclusive timings.'};
 return completedSnapshot;
}
function snapshotReport(){const s=snapshotActive;return s?{active:true,days:s.days,plannedDays:s.maxDays,calls:s.calls,totalMs:s.totalMs,maxMs:s.maxMs,byReason:clone(s.byReason),segments:clone(s.byStage)}:completedSnapshot;}
function measureStage(stage,w,original,that,args){
 const s=snapshotActive;if(!s||s.world!==w)return original.apply(that,args);
 const frame={child:0},start=clock();s.stack.push(frame);
 try{return original.apply(that,args);}finally{
  const inclusiveMs=Math.max(0,clock()-start),exclusiveMs=Math.max(0,inclusiveMs-frame.child);
  s.stack.pop();if(s.stack.length)s.stack[s.stack.length-1].child+=inclusiveMs;
  const m=s.byStage[stage]||(s.byStage[stage]={calls:0,inclusiveMs:0,exclusiveMs:0,maxMs:0});
  m.calls++;m.inclusiveMs+=inclusiveMs;m.exclusiveMs+=exclusiveMs;m.maxMs=Math.max(m.maxMs,inclusiveMs);
 }
}
function downloadSnapshot(){const data=snapshotReport();if(!data)throw Error('H1B1 스냅샷 진단을 먼저 시작하세요.');if(typeof document!=='undefined'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`vilob-v035H1B1-snapshot-${data.finish?.year||'active'}y-diagnostic.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 return data;
}
function installPanel(ui){
 if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1bPanel');if(!host)return;
 let panel=document.getElementById('v035h1b1Panel');
 if(!panel){panel=document.createElement('div');panel.id='v035h1b1Panel';panel.className='panel';panel.style.marginTop='10px';
 panel.innerHTML='<h3>H1B1 · 스냅샷 내부 진단</h3><div class="small muted">같은 체크포인트를 불러온 뒤 독립적으로 실행하세요. 180일 후 자동 종료됩니다.</div><div class="button-grid"><button id="v035h1b1SnapStart">스냅샷 180일 진단 시작</button><button id="v035h1b1SnapStop">진단 종료</button><button id="v035h1b1SnapJSON">스냅샷 진단 JSON</button></div><div class="small muted" id="v035h1b1SnapStatus"></div>';
 host.appendChild(panel);const el=id=>document.getElementById(id);
 el('v035h1b1SnapStart').onclick=()=>{try{startSnapshot(ui.world);installPanel(ui);}catch(e){el('v035h1b1SnapStatus').textContent=e.message;}};
 el('v035h1b1SnapStop').onclick=()=>{stopSnapshot();installPanel(ui);};
 el('v035h1b1SnapJSON').onclick=()=>{try{downloadSnapshot();}catch(e){el('v035h1b1SnapStatus').textContent=e.message;}};}
 const st=document.getElementById('v035h1b1SnapStatus'),r=snapshotReport();if(st)st.textContent=r?`진단 ${r.active?'실행 중':'완료'} · ${r.days??r.observedDays}/${r.plannedDays}일 · 스냅샷 ${r.calls}회 · 누적 ${r.totalMs.toFixed(1)}ms`:'스냅샷 진단 없음';
}
if(NS.UI){const prev=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...args){const r=prev.apply(this,args);installPanel(this);return r;};}
const snapshotOriginal=NS.Telemetry.prototype.snapshot;NS.Telemetry.prototype.snapshot=function(w,...args){const prev=snapshotScope;snapshotScope={world:w,rows:null,length:0,byId:null};try{return snapshotOriginal.call(this,w,...args);}finally{snapshotScope=prev;}};
const oldSetWorld=NS.UI?.prototype.setWorld;if(oldSetWorld)NS.UI.prototype.setWorld=function(w,...args){if(snapshotActive&&snapshotActive.world!==w)stopSnapshot();return oldSetWorld.call(this,w,...args);};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-23',title:'Checkpoint Integrity & Snapshot Hotpath · H1B1',summary:'동일 H1A 계열 체크포인트의 원본/복원 서명 단계별 검사, 원본 증명된 서명 필드만 선택적 보정, 로컬 차이 진단, 스냅샷 inclusive 분석과 관측 중 국가 ID 조회 캐시.',sections:[['체크포인트',['저장된 JSON 자체의 세계 서명을 검증한 다음 복원 결과를 비교합니다.','누락된 사람·타일 등은 자동 생성하지 않고 오류로 보고합니다.','복원 시 레거시 attach가 고쳐쓴 서명 대상 필드만 원본으로 되돌립니다.']],['관측 성능',['H1B 기존 4모드 진단을 유지하고 별도 스냅샷 계측을 제공합니다.','스냅샷 기록 주기나 1683열 CSV를 변경하지 않습니다.']]]});
/* H1B2: redundant version-only UI wrapper omitted */
NS.V035H1B1=Object.freeze({version:VERSION,reconcile,recentDiagnostic,downloadDiagnostic,lookupVillage,startSnapshot,stopSnapshot,snapshotReport,measureStage,downloadSnapshot});
})(window.VSim);

;
/* H1B2 bundled source: v035h1b1a.js */
/* V0.35H1B1A — wartime checkpoint continuity.
 * Repairs lossy legacy formation rehydration after the full prior loader chain.
 * No forced tactical actions, RNG calls, occupation progress grants or timer advances.
 */
(function(NS){'use strict';
if(!NS?.World||!NS?.V035H1A||!NS?.V035H1B1||!NS?.MilitaryFormation)return;
const VERSION='V0.35H1B1A',PRIOR='V0.35H1B1';
const copy=x=>JSON.parse(JSON.stringify(x));
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const key=x=>String(x?.id);
const signature=x=>JSON.stringify(x);
let latest=null,latestWorld=null;
// Legacy MilitaryFormation.from only copied the V0.32D constructor fields, and
// consequently erased V0.33C-I military timers, war assignments and command
// ownership when a loader/UI normalized a plain JSON Formation.
const originalFormationFrom=NS.MilitaryFormation.from;
NS.MilitaryFormation.from=function(saved){
 const f=originalFormationFrom.call(this,saved);
 if(saved&&typeof saved==='object')Object.assign(f,saved);
 if(Array.isArray(saved?.cohortIds))f.cohortIds=[...saved.cohortIds];
 return f;
};
function wartimeData(raw){return (raw?.v33?.war?.wars||[]).filter(x=>x.status==='ACTIVE');}
function diagnostic(raw,w){
 const result={format:'vilob-v035h1b1a-war-rehydration-v1',version:VERSION,date:[raw.year,raw.season,raw.day],activeWars:wartimeData(raw).map(x=>({warId:x.id,sides:[x.sideAIds||[],x.sideBIds||[]]})),formationCount:0,restoredFormations:0,missingFormations:[],changedFormationFields:0,occupationCount:0,restoredOperations:0,changedOperations:0,warStateChanged:false,status:'CHECKING'};
 latest=result;
 const villages=new Map((w.villages||[]).map(v=>[key(v),v]));
 for(const sv of raw.villages||[]){if(!sv.v32dMilitary||!Array.isArray(sv.v32dMilitary.formations))continue;
  const v=villages.get(key(sv));if(!v){result.missingFormations.push({villageId:sv.id,reason:'MISSING_NATION'});continue;}
  const formations=new Map((v.v32dMilitary?.formations||[]).map(f=>[key(f),f]));
  // Do not replace the military registry wholesale: restore each existing
  // Formation in-place so downstream cohort/war links continue to point to it.
  for(const sf of sv.v32dMilitary.formations){result.formationCount++;
   const f=formations.get(key(sf));if(!f){result.missingFormations.push({villageId:sv.id,formationId:sf.id,reason:'MISSING_FORMATION'});continue;}
   if(signature(sf)!==signature(f))result.changedFormationFields++;
   // Restore *all* serialized fields, not just the original 0.32D subset;
   // also delete attach-created own fields not present in the saved instance.
   for(const k of Object.keys(f))if(!own(sf,k))delete f[k];
   Object.assign(f,copy(sf));
   Object.setPrototypeOf(f,NS.MilitaryFormation.prototype);
   result.restoredFormations++;
  }
  // A valid checkpoint cannot silently acquire or lose a military Formation.
  if(formations.size!==sv.v32dMilitary.formations.length){
   for(const f of formations.values())if(!sv.v32dMilitary.formations.some(sf=>key(sf)===key(f)))result.missingFormations.push({villageId:sv.id,formationId:f.id,reason:'EXTRA_FORMATION'});
  }
  // Preserve the original timing of formation reviews without resetting the
  // rest of the Nation's post-load caches and object identities.
  for(const k of ['v33dLastAssignmentCal','v33dLastWarPlanCal'])if(own(sv,k))v[k]=copy(sv[k]);
 }
 const tiles=new Map((w.map?.tiles||[]).map(t=>[key(t),t]));
 for(const st of raw.map?.tiles||[]){
  const t=tiles.get(key(st));
  if(!own(st,'v33OccupationOperation')){if(t&&own(t,'v33OccupationOperation')){delete t.v33OccupationOperation;result.changedOperations++;}continue;}
  result.occupationCount++;if(!t){result.missingFormations.push({tileId:st.id,reason:'MISSING_OCCUPATION_TILE'});continue;}
  if(signature(st.v33OccupationOperation)!==signature(t.v33OccupationOperation))result.changedOperations++;
  t.v33OccupationOperation=copy(st.v33OccupationOperation);
  result.restoredOperations++;
 }
 // War pulse/engagement schedulers live outside the H1A compact fingerprint.
 // Legacy attachWorld hooks can re-plan and mutate them without violating that
 // signature, so the authenticated saved war state must be authoritative.
 if(wartimeData(raw).length){
  if(own(raw,'v33')&&own(raw.v33,'war')){
   result.warStateChanged=signature(raw.v33.war)!==signature(w.v33War);
   w.v33War=copy(raw.v33.war);
  }
  for(const k of ['v33d','v33c','v33e5'])if(own(raw,k))w[k]=copy(raw[k]);
 }
 if(result.missingFormations.length){result.status='MISSING_MILITARY_ENTITIES';throw Error('전쟁 체크포인트에서 군사 개체 누락/증가가 발견됐습니다. 원본을 보존하고 진단을 확인하세요.');}
 result.status='RESTORED';return result;
}
const fromBefore=NS.World.from;
NS.World.from=function(raw,...args){const w=fromBefore.call(this,raw,...args);
 // Only checkpoint-era input, never historical migration or fresh world.
 if(raw?.v35h1a?.enabled&&raw?.v33?.war){
  try{latestWorld=w;latest=diagnostic(raw,w);}catch(e){if(latest)latest.error=String(e.message);throw e;}
 }
 return w;
};
function report(){if(!latest)return null;const out=copy(latest),w=latestWorld;if(w){
 out.current={year:w.year,season:w.season,day:w.day,calendarOrdinalDay:w.calendarOrdinalDay?.(),warLastPulseCal:w.v33War?.lastPulseCal??null,
 activeWars:(w.v33War?.wars||[]).filter(x=>x.status==='ACTIVE').map(x=>({warId:x.id,status:x.status})),
 formations:(w.villages||[]).flatMap(v=>(v.v32dMilitary?.formations||[]).map(f=>({nationId:v.id,formationId:f.id,tileId:f.tileId,targetTileId:f.targetTileId,status:f.status,assignedWarId:f.v33dAssignedWarId,nextMoveCal:f.v33c1NextMoveCal,mission:f.v33dMission,cohorts:[...(f.cohortIds||[])]}))),
 occupations:(w.map?.tiles||[]).filter(t=>t.v33OccupationOperation).map(t=>({tileId:t.id,warId:t.v33OccupationOperation.warId,progress:t.v33OccupationOperation.progress,requirement:t.v33OccupationOperation.requirement,status:t.v33OccupationOperation.status,lastProgressCal:t.v33OccupationOperation.lastProgressCal}))};
 }return out;}
function exportDiagnostic(){if(!latest)throw Error('전쟁 체크포인트 복원 기록이 없습니다.');const data=report();if(typeof document!=='undefined'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`vilob-v035H1B1A-war-load-${latest.date?.[0]||'unknown'}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}return data;}
function install(ui){if(typeof document==='undefined')return;const host=document.getElementById('v035h1aPanel');if(!host)return;
 if(!document.getElementById('v035h1b1aWarDiag')){const btn=document.createElement('button');btn.id='v035h1b1aWarDiag';btn.textContent='전쟁 복원 진단 JSON';btn.onclick=()=>{try{exportDiagnostic();}catch(e){const st=document.getElementById('v035h1aStatus');if(st)st.textContent=e.message;}};host.querySelector?.('.button-grid')?.appendChild(btn);}
}
if(NS.UI){const oldRender=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...args){const r=oldRender.apply(this,args);install(this);return r;};/* H1B2: redundant version-only UI wrapper omitted */}
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-24',title:'Wartime Checkpoint Continuity · H1B1A',summary:'전쟁 중 체크포인트에서 Formation의 전체 필드·이동 시각·배속·점령 작전과 전쟁 제어 상태를 보존하며 원본에 없는 병력을 생성하지 않습니다.',sections:[['복원',['V0.32D 객체 복원 시 누락되던 V0.33C~I Formation 고유 필드를 보존합니다.','전쟁/점령 진행 정보 및 이동 예정일은 원본 체크포인트가 우선합니다.','필수 Formation이 누락되면 보정 생성 대신 오류로 차단합니다.']],['회귀',['전쟁 중 저장→복원→후속 진행을 검사합니다.','기존 H1B1 진단, 저장 서명 검증, 기술 43개 및 CSV 1,683열을 유지합니다.']]]});
NS.V035H1B1A=Object.freeze({version:VERSION,report,exportDiagnostic});
})(window.VSim);

;(function(NS){'use strict';const old=NS?.Telemetry?.prototype?.snapshot;if(!old)return;NS.Telemetry.prototype.snapshot=function(...args){const probe=NS.V035H1B1?.measureStage;return probe?probe('35H_OBSERVATION_STACK',args[0],old,this,args):old.apply(this,args);};})(window.VSim);

;
/* H1B2 bundled source: v035h1b2.js */
/* V0.35H1B2 — startup/runtime consolidation; observation only.
 * Old bootstraps retain their full execution order. The build replaces a
 * strictly audited set of version-only renderHeader wrappers in distribution
 * code; all gameplay, save migration and military rehydration remain intact.
 */
(function(NS){'use strict';
if(!NS?.UI||!NS?.World||!NS?.V035H1B1A)return;
const VERSION='V0.35H1B2';
const perf=typeof performance!=='undefined'?performance:null;
const finishedAt=perf?.now?.()??null;
function badge(){if(typeof document==='undefined')return;
 const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}
 document.title='Village Observer '+VERSION;
 const gate=document.getElementById('vilob-h1b2-startup-gate');if(gate)gate.remove();
}
function report(){
 const p=perf,nav=p?.getEntriesByType?.('navigation')?.[0]||null;
 const resources=p?.getEntriesByType?.('resource')||[];
 const js=resources.filter(e=>/\.js(?:\?|$)/.test(e.name));
 const style=resources.filter(e=>/\.css(?:\?|$)/.test(e.name));
 return {format:'vilob-v035h1b2-startup-v1',version:VERSION,elapsedToBootstrapEndMs:finishedAt,
  navigation:nav?{type:nav.type,domInteractiveMs:nav.domInteractive,domContentLoadedMs:nav.domContentLoadedEventEnd,loadEventEndMs:nav.loadEventEnd,responseEndMs:nav.responseEnd}:null,
  resourceCount:resources.length,jsResourceCount:js.length,cssResourceCount:style.length,
  scriptRequestsExpectedHosted:166,notes:'Timing includes network, legacy initializers and rendering; measurements must be compared in the same device/cache mode. Resource timings may be restricted by browser privacy or file:// protocol.'};
}
function exportJSON(){const data=report();if(typeof document!=='undefined'){
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='vilob-v035H1B2-startup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }return data;
}
function install(){if(typeof document==='undefined')return;
 const host=document.getElementById('v035h1aPanel')||document.getElementById('v035h1bPanel');if(!host||document.getElementById('v035h1b2StartupJson'))return;
 const heading=host.querySelector?.('h3');if(heading&&heading.textContent?.startsWith('H1B1A ·'))heading.textContent=heading.textContent.replace('H1B1A ·','H1B2 ·');
 const target=host.querySelector?.('.button-grid')||host;
 const btn=document.createElement('button');btn.id='v035h1b2StartupJson';btn.textContent='H1B2 시작 성능 JSON';btn.title='로딩·부트스트랩·JS 요청 수 계측 (동일 PC, Cold/Warm 구분)';btn.onclick=()=>exportJSON();target.appendChild(btn);
}
const renderHeader=NS.UI.prototype.renderHeader;
NS.UI.prototype.renderHeader=function(...a){const r=renderHeader.apply(this,a);badge();return r;};
const renderWorld=NS.UI.prototype.renderWorld;
NS.UI.prototype.renderWorld=function(...a){const r=renderWorld.apply(this,a);install();return r;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-24',title:'Startup & Runtime Consolidation V1',summary:'GitHub Pages 후속 패치 59개를 실행 순서 보존형 번들로 통합하고, 검증된 버전 전용 헤더 래퍼를 제거합니다. 저장·복원 및 게임 판단은 변경하지 않습니다.',sections:[['시작 성능',['후속 부트스트랩을 하나의 JS 자산으로 묶어 네트워크 요청 수를 줄입니다.','과거 버전 번호의 화면 순차 노출을 막고 최신 버전만 표시합니다.','선택형 시작 성능 JSON에서 탐색·스크립트 요청 수와 로드 시간을 제공합니다.']],['동작 보존',['169 보호 블록·기술 43개·CSV 1,683열·H1B1A 전쟁 Formation 및 점령 복원을 유지합니다.','기반 165개 스크립트와 저장·복원 래퍼 순서는 변경하지 않습니다.']]]});
NS.V035H1B2=Object.freeze({version:VERSION,report,exportJSON});
try{badge();}catch(e){console.warn('H1B2 badge',e);}
})(window.VSim);

;
/* H1B2 bundled source: v035h1c.js */
/* V0.35H1C — lossless checkpoint gzip and local size attribution.
 * No game model, serialization schema, save migrations or RNG modifications.
 */
(function(NS){'use strict';
if(!NS?.V035H1A||!NS?.SaveSystem||!NS?.UI)return;
const VERSION='V0.35H1C',FORMAT='vilob-v035h1c-storage-v1';
const clock=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const human=n=>(n/1048576).toFixed(2)+' MiB';
let latest=null,busy=false;
function download(name,blob){if(typeof document==='undefined')return blob;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);return blob;}
function status(message){if(typeof document!=='undefined'){const el=document.getElementById('v035h1cStatus');if(el)el.textContent=message;}}
function assertAvailable(which){if(typeof globalThis[which]!=='function')throw Error(which+' API를 지원하지 않는 브라우저입니다. JSON 체크포인트를 이용하세요.');}
function fileName(w,ext){const seed=w?.v35h1a?.seed||'WORLD',day=w?.calendarOrdinalDay?.()??'unknown';return `vilob-PERF-${seed}-${day}d-checkpoint.${ext}`;}
function prepare(w){const t0=clock(),obj=NS.V035H1A.scenario(w),t1=clock(),text=JSON.stringify(obj),t2=clock();return {meta:{worldVersion:obj.world.version,signature:obj.perf.stateSignature,rngState:obj.perf.rngState},text,times:{serializeMs:t1-t0,stringifyMs:t2-t1},jsonBytes:new Blob([text]).size};}
async function compressText(text){assertAvailable('CompressionStream');
 const src=new Blob([text],{type:'application/json'}),stream=src.stream().pipeThrough(new CompressionStream('gzip'));
 return await new Response(stream).blob();
}
async function gzipCheckpoint(w,opts={download:true}){
 if(busy)throw Error('저장·압축 작업이 이미 진행 중입니다.');busy=true;status('원본 상태와 JSON을 생성하고 있습니다…');
 try{const p=prepare(w),start=clock();status('gzip으로 무손실 압축 중…');const blob=await compressText(p.text),end=clock();
  const r={format:FORMAT,version:VERSION,operation:'gzipExport',year:Number(w.year),calendarDay:w.calendarOrdinalDay?.()??null,originalBytes:p.jsonBytes,gzipBytes:blob.size,ratio:blob.size/p.jsonBytes,serializeMs:p.times.serializeMs,stringifyMs:p.times.stringifyMs,gzipMs:end-start,worldVersion:p.meta.worldVersion,signature:p.meta.signature,rngState:p.meta.rngState,measurement:'Times are browser wall clock and exclude download; compressed size does not indicate lower runtime heap usage.'};latest=r;
  if(opts.download!==false)download(fileName(w,'json.gz'),blob);status(`gzip 내보내기 완료 · ${human(p.jsonBytes)} → ${human(blob.size)} (${(100*r.ratio).toFixed(1)}%)`);
  return {blob,report:r};
 }catch(e){status('gzip 저장 실패: '+e.message);throw e;}finally{busy=false;}
}
async function textFromCheckpoint(file){
 if(typeof file==='string')return {text:file,compressed:false};
 if(!file||typeof file.text!=='function')throw Error('유효한 체크포인트 파일을 선택하세요.');
 const head=new Uint8Array(await file.slice(0,2).arrayBuffer()),gzip=head[0]===0x1f&&head[1]===0x8b;
 const namedGzip=/\.gz$/i.test(file.name||'');
 if(namedGzip&&!gzip)throw Error('파일 확장자가 .gz이지만 gzip 헤더가 없습니다.');
 if(!gzip)return {text:await file.text(),compressed:false};
 assertAvailable('DecompressionStream');
 try{return {text:await new Response(file.stream().pipeThrough(new DecompressionStream('gzip'))).text(),compressed:true};}
 catch(e){throw Error('gzip 압축 해제에 실패했습니다: '+e.message);}
}
async function importCheckpoint(file){
 if(busy)throw Error('저장·압축 작업이 이미 진행 중입니다.');busy=true;status('체크포인트 파일 검사 및 압축 해제 중…');
 try{const t0=clock(),decoded=await textFromCheckpoint(file),t1=clock();status('기존 서명·RNG·전쟁 상태 복원 검사 중…');
  const world=await NS.V035H1A.importCheckpoint(decoded.text),t2=clock();latest={format:FORMAT,version:VERSION,operation:'import',compressed:decoded.compressed,decodeMs:t1-t0,validateAndRestoreMs:t2-t1,year:world.year,rngState:world.v35h1a?.rngState,signature:NS.V035H1A.fingerprint(world)};
  status(`${decoded.compressed?'gzip':'JSON'} 체크포인트 불러오기 완료 · ${world.year}년`);return world;
 }catch(e){status('불러오기 실패: '+e.message);throw e;}finally{busy=false;}
}
function sizeReport(w){const start=clock(),s=w.serialize(),fields=[];let all=0;
 for(const [key,value] of Object.entries(s)){const bytes=new Blob([JSON.stringify(value)??'null']).size;all+=bytes;fields.push({key,bytes});}
 fields.sort((a,b)=>b.bytes-a.bytes);
 const telemetry=s.telemetry||s._telemetry||null,children=[];
 if(telemetry&&typeof telemetry==='object')for(const [key,value] of Object.entries(telemetry)){const bytes=new Blob([JSON.stringify(value)??'null']).size;children.push({key,bytes});}
 children.sort((a,b)=>b.bytes-a.bytes);
 const result={format:FORMAT,version:VERSION,operation:'sizeAttribution',year:w.year,calendarDay:w.calendarOrdinalDay?.(),estimateBytes:all,topLevelFields:fields,telemetryFields:children,elapsedMs:clock()-start,notes:'Measurements are serialized JSON UTF-8 byte estimates per field, not compressed bytes; add property names/delimiters for exact full JSON size. Does not remove or mutate any saved state.'};latest=result;return result;
}
function exportAnalysis(w){const r=sizeReport(w);download(`vilob-v035H1C-size-${w.year}y.json`,new Blob([JSON.stringify(r,null,2)],{type:'application/json'}));status('용량 분석 완료 · 상위 필드 '+r.topLevelFields.slice(0,3).map(x=>x.key+' '+human(x.bytes)).join(', '));return r;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const root=document.getElementById('v035h1aPanel');if(!root)return;
 if(!document.getElementById('v035h1cPanel')){
  const panel=document.createElement('div');panel.className='panel';panel.id='v035h1cPanel';panel.style.marginTop='10px';
  panel.innerHTML='<h3>H1C · 무손실 체크포인트</h3><div class="small muted">gzip 압축은 저장 데이터·서명·전쟁 명령을 변경하지 않습니다. 전체 JSON 백업도 유지됩니다.</div><div class="button-grid"><button id="v035h1cExport">압축 체크포인트 (.json.gz)</button><button id="v035h1cPlain">비압축 JSON 체크포인트</button><label class="file-btn">JSON / gzip 불러오기<input id="v035h1cImport" type="file" accept=".json,.gz,.json.gz,application/json,application/gzip"></label><button id="v035h1cSizes">저장 항목 용량 분석 JSON</button><button id="v035h1cMetrics">최근 저장·불러오기 성능 JSON</button></div><div class="small muted" id="v035h1cStatus"></div>';
  root.appendChild(panel);
  const q=id=>document.getElementById(id);
  q('v035h1cExport').onclick=async()=>{try{await gzipCheckpoint(ui.world);}catch(e){console.warn('H1C gzip',e);}};
  q('v035h1cPlain').onclick=()=>{try{NS.SaveSystem.exportH1ACheckpoint(ui.world);status('비압축 JSON 체크포인트 내보내기 완료');}catch(e){status(e.message);}};
  q('v035h1cImport').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!confirm('현재 세계를 종료하고 선택한 체크포인트를 불러올까요?'))return;const w=await importCheckpoint(f);ui.setWorld(w);ui.render?.();}catch(err){status('체크포인트 오류: '+err.message);}finally{e.target.value='';}};
  q('v035h1cSizes').onclick=()=>{try{exportAnalysis(ui.world);}catch(e){status('분석 실패: '+e.message);}};
  q('v035h1cMetrics').onclick=()=>{if(!latest){status('먼저 저장·불러오기·용량 분석을 실행하세요.');return;}download('vilob-v035H1C-storage-diagnostic.json',new Blob([JSON.stringify(latest,null,2)],{type:'application/json'}));};
 }
 // H1C becomes the default checkpoint workflow; explicitly retain legacy JSON.
 const oldButton=document.getElementById('v035h1aCheckpoint');if(oldButton&&!oldButton.dataset.h1cDefault){oldButton.dataset.h1cDefault='true';oldButton.textContent='현재 체크포인트 gzip (H1C)';oldButton.onclick=async()=>{try{await gzipCheckpoint(ui.world);}catch(e){console.warn('H1C gzip',e);}};}
 const oldImport=document.getElementById('v035h1aImport');if(oldImport&&!oldImport.dataset.h1cImport){oldImport.dataset.h1cImport='true';oldImport.accept='.json,.json.gz,.gz,application/json,application/gzip';oldImport.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(!confirm('현재 세계를 종료하고 체크포인트를 불러올까요?'))return;const w=await importCheckpoint(f);ui.setWorld(w);ui.render?.();}catch(ex){status('체크포인트 오류: '+ex.message);}finally{e.target.value='';}};}
}
const prevRender=NS.UI.prototype.renderWorld;NS.UI.prototype.renderWorld=function(...a){const out=prevRender.apply(this,a);install(this);return out;};
NS.SaveSystem={...NS.SaveSystem,exportH1CGzipCheckpoint:gzipCheckpoint,importH1CCheckpoint:importCheckpoint,exportH1CSizeAnalysis:exportAnalysis};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-24',title:'Save Data Optimization V1',summary:'기존 체크포인트 구조를 변경하지 않는 gzip 무손실 저장·불러오기, 이전 JSON 호환 및 저장 구성 계측.',sections:[['압축 저장',['고정 세계 체크포인트를 .json.gz 파일로 내보내고 기존 서명·RNG·전쟁 복원 체인을 통해 불러옵니다.','비압축 JSON도 별도 버튼으로 지원합니다.']],['진단',['상위 저장 항목별 UTF-8 크기와 Telemetry 내부 용량을 작은 JSON으로 추출합니다.','게임 세계·기술·전쟁 상태·CSV·관측 기록은 변경하지 않습니다.']]]});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const prevHeader=NS.UI.prototype.renderHeader;NS.UI.prototype.renderHeader=function(...a){const r=prevHeader.apply(this,a);badge();return r;};badge();
NS.V035H1C=Object.freeze({version:VERSION,gzipCheckpoint,importCheckpoint,textFromCheckpoint,compressText,sizeReport,exportAnalysis,lastReport:()=>latest,install});
})(window.VSim);

;
/* H1B2 bundled source: v035h1c1.js */
/* V0.35H1C1 — observation-only stage attribution and snapshot-scoped read caching.
 * No world data, RNG, save schema, snapshot cadence or ledger retention changes.
 */
(function(NS){'use strict';
if(!NS?.Telemetry||!NS?.V034D1||!NS?.V035H1B1||!NS?.V034D3A)return;
const VERSION='V0.35H1C1';
let active=null, lastCache={snapshots:0,prepared:0,preparedHits:0,aggregates:0,aggregateHits:0},started=null;
const reset=()=>{lastCache={snapshots:0,prepared:0,preparedHits:0,aggregates:0,aggregateHits:0};};
const originalD1=NS.V034D1;
// The D1 observer API is frozen; replace its namespace binding, not its functions.
// Every cache exists for only one synchronous snapshot; never carry it into a new day.
NS.V034D1=Object.freeze({...originalD1,
 prepare(w){if(!active||active.world!==w)return originalD1.prepare(w);
  if(!active.prepared){active.prepared=originalD1.prepare(w);lastCache.prepared++;}else lastCache.preparedHits++;
  return active.prepared;},
 all(w,...args){if(!active||active.world!==w)return originalD1.all(w,...args);
  if(!active.aggregates){active.aggregates=originalD1.all(w,...args);lastCache.aggregates++;}else lastCache.aggregateHits++;
  return active.aggregates;}
});
const priorSnapshot=NS.Telemetry.prototype.snapshot;
NS.Telemetry.prototype.snapshot=function(w,...args){
 if(active)return priorSnapshot.call(this,w,...args); // nested snapshot: no cache lifetime change
 active={world:w,prepared:null,aggregates:null};lastCache.snapshots++;
 try{return priorSnapshot.call(this,w,...args);}finally{active=null;}
};
function start(w){if(!w)throw Error('먼저 세계를 불러오세요.');reset();started={year:w.year,calendarDay:w.calendarOrdinalDay?.(),rngState:w.v35h1a?.rngState,signature:NS.V035H1A?.fingerprint(w)};
 return NS.V035H1B1.startSnapshot(w);}
function ledger(w){const s=NS.V034D3A.stats(w);return {windows:s?.windows?.length||0,completedRows:(s?.windows||[]).reduce((n,p)=>n+(p.rows?.length||0),0),latestWindowRows:s?.windows?.at(-1)?.rows?.length||0,periods:s?.periods||0,liveGroups:Object.keys(s?.live?.groups||{}).length,hasCurrentLedger:!!s?.live};}
function report(w){const snap=NS.V035H1B1.snapshotReport();if(!snap)return null;
 const done=snap.finish||null;
 return {format:'vilob-v035h1c1-observation-v1',version:VERSION,active:!!snap.active,
  observedDays:snap.observedDays??snap.days??0,plannedDays:snap.plannedDays,start:started||snap.start,finish:done,
  snapshot:{calls:snap.calls,totalMs:snap.totalMs,maxMs:snap.maxMs,meanMs:snap.meanMs??(snap.calls?snap.totalMs/snap.calls:0),byReason:snap.byReason,stages:snap.segments},
  cache:{...lastCache},storage:{snapshots:w?.telemetry?.snapshots?.length??null,entries:w?.telemetry?.entries?.length??null,yearlySummaries:w?.telemetry?.yearlySummaries?.length??null,settlementYearly:w?.telemetry?.settlementYearly?.length??null,d3a:w?ledger(w):null},
  notes:['Stage timings are nested inclusive; use exclusiveMs for disjoint attribution. Do not sum inclusiveMs.','D1 read-only caches last only for a single snapshot invocation.','All observation values, history retention rules, storage fields and RNG behavior remain unchanged.']};}
function download(w){const r=report(w);if(!r)throw Error('H1C1 진단을 먼저 실행하세요.');if(typeof document!=='undefined'){
 const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`vilob-v035H1C1-observation-${w?.year||'world'}y.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);}
 return r;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1b1Panel')||document.getElementById('v035h1cPanel');if(!host)return;
 let panel=document.getElementById('v035h1c1Panel');if(!panel){panel=document.createElement('div');panel.id='v035h1c1Panel';panel.className='panel';panel.style.marginTop='10px';
 panel.innerHTML='<h3>H1C1 · 관측 비용 및 D3A 장부 진단</h3><div class="small muted">180일 동안 기존 Snapshot 타이머와 추가 계층을 분석합니다. 기록 주기와 데이터는 그대로 유지됩니다.</div><div class="button-grid"><button id="v035h1c1Start">H1C1 180일 진단 시작</button><button id="v035h1c1Stop">진단 종료</button><button id="v035h1c1JSON">H1C1 진단 JSON</button></div><div class="small muted" id="v035h1c1Status"></div>';
 host.appendChild(panel);const q=id=>document.getElementById(id);
 q('v035h1c1Start').onclick=()=>{try{start(ui.world);install(ui);}catch(e){q('v035h1c1Status').textContent=e.message;}};
 q('v035h1c1Stop').onclick=()=>{NS.V035H1B1.stopSnapshot();install(ui);};
 q('v035h1c1JSON').onclick=()=>{try{download(ui.world);}catch(e){q('v035h1c1Status').textContent=e.message;}};}
 const status=document.getElementById('v035h1c1Status'),r=report(ui.world);if(status)status.textContent=r?`진단 ${r.active?'진행 중':'종료'} · ${r.observedDays}/${r.plannedDays}일 · Snapshot ${r.snapshot.calls}회 · D1 집계 재사용 ${r.cache.aggregateHits}회`:'시작 전';}
const previousWorld=NS.UI?.prototype?.renderWorld;
if(previousWorld)NS.UI.prototype.renderWorld=function(...args){const out=previousWorld.apply(this,args);install(this);return out;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-25',title:'Observation Hotpath & Memory Optimization V1',summary:'정기 스냅샷 내부 계층 계측 확장 및 단일 스냅샷 범위의 D1 정착지 읽기 전용 조회 중복 제거; 기록·RNG·저장 정책 보존.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const h=NS.UI?.prototype?.renderHeader;if(h)NS.UI.prototype.renderHeader=function(...a){const r=h.apply(this,a);badge();return r;};badge();
NS.V035H1C1=Object.freeze({version:VERSION,start,report,download,ledger,cache:()=>({...lastCache})});
})(window.VSim);

;
/* H1B2 bundled source: v035h1c2.js */
/* V0.35H1C2 — Simulation State / Domain Event / Observation boundary V1.
 * Legacy Telemetry is still produced exactly as before; game-critical effects
 * must not be disabled by observation or diagnostic lifecycle settings.
 */
(function(NS){'use strict';
if(!NS?.World||!NS?.Telemetry||!NS?.V033F5A4)return;
const VERSION='V0.35H1C2',KEY='v35h1c2',SCHEMA=1;
const memory=new WeakMap();
const counters={decisionsCaptured:0,stateHits:0,legacyHydrations:0,legacyLogLookups:0,domainWarDeclarations:0};
function ensure(w){if(!w)return null;if(!w[KEY]||typeof w[KEY]!=='object')w[KEY]={schema:SCHEMA,aiLast:{}};
 if(!w[KEY].aiLast||typeof w[KEY].aiLast!=='object')w[KEY].aiLast={};return w[KEY];}
function originalDecision(w,id,day){const es=w?.telemetry?.entries||[];counters.legacyLogLookups++;
 for(let i=es.length-1;i>=0;i--){const e=es[i];if((e.ordinalDay||0)<day-1)break;if(e.type==='AI_DECISION'&&e.payload?.villageId===id)return e;}return null;}
function lastDecision(w,v,day=w.ordinalDay()){
 if(!w||!v)return null;const id=String(v.id),state=ensure(w);let cache=memory.get(w);if(!cache){cache=new Map();memory.set(w,cache);}
 let e=cache.get(id);if(e&&Number(e.ordinalDay)>=day-1&&Number(e.ordinalDay)<=day){counters.stateHits++;return e;}
 const saved=state.aiLast[id];if(saved&&Number(saved.ordinalDay)>=day-1&&Number(saved.ordinalDay)<=day){
  // Try to rebind to the actual historical record so legacy observation wrappers
  // that mutate e.payload still change the same original telemetry entry.
  e=originalDecision(w,v.id,day);
  if(!e)e={ordinalDay:saved.ordinalDay,type:'AI_DECISION',payload:saved.payload};
  cache.set(id,e);counters.stateHits++;return e;
 }
 // Legacy H1C1 saves have no SimulationState. Hydrate exactly once when needed.
 e=originalDecision(w,v.id,day);if(e){state.aiLast[id]={ordinalDay:e.ordinalDay,payload:e.payload};cache.set(id,e);counters.legacyHydrations++;return e;}
 cache.delete(id);return null;
}
function capture(type,w,payload,t){if(type!=='AI_DECISION'||!w||!payload||payload.villageId==null)return;
 const es=t?.entries||[],e=es[es.length-1];if(!e||e.type!==type||e.payload!==payload)return;
 const state=ensure(w),id=String(payload.villageId);state.aiLast[id]={ordinalDay:e.ordinalDay,payload:e.payload};
 let cache=memory.get(w);if(!cache){cache=new Map();memory.set(w,cache);}cache.set(id,e);counters.decisionsCaptured++;
}
// Attach to the *outermost* record wrapper. Preserve all original callbacks,
// payload mutation, event order and return value. Observation stays enabled.
const previousRecord=NS.Telemetry.prototype.record;
NS.Telemetry.prototype.record=function(type,w,payload={}){const r=previousRecord.call(this,type,w,payload);capture(type,w,payload,this);return r;};
const previousSerialize=NS.World.prototype.serialize;
NS.World.prototype.serialize=function(...args){const data=previousSerialize.apply(this,args),state=ensure(this);
 // Copy the slim, authoritative recent AI decision state. No runtime WeakMap,
 // profiling counters, or observation toggles enter checkpoint data.
 data[KEY]={schema:SCHEMA,aiLast:state.aiLast};return data;};
const previousFrom=NS.World.from;
NS.World.from=function(data,...args){const world=previousFrom.call(this,data,...args);if(world){const source=data?.[KEY];if(source?.schema===SCHEMA&&source.aiLast){world[KEY]={schema:SCHEMA,aiLast:source.aiLast};}else ensure(world);}return world;};
const DomainEvents=Object.freeze({
 legacyWarDeclared(w,payload){counters.domainWarDeclarations++;
  // Migrated call-site from protected legacy/126; retain its exact former
  // point in Telemetry.record call chain. Not yet a standalone event bus.
  return NS.V033F5A4.repairWarTargets(w,true);},
 classifiedTypes:Object.freeze(['WAR_DECLARED33','WAR_ENDED33','TILE_OCCUPIED33','TILE_LIBERATED33'])
});
const SimulationState=Object.freeze({lastDecision,get(w){return ensure(w);},schema:SCHEMA});
const Observer=Object.freeze({name:'Observation Telemetry',snapshot(w){return w?.telemetry?.snapshots||[];},events(w){return w?.telemetry?.entries||[];},lifecycle:'ACTIVE',disableSupported:false});
const Diagnostics=Object.freeze({name:'Diagnostic Trace',enabled:false,mode:'RESERVE',stats(){return {...counters};}});
const inventory=Object.freeze({
 format:'vilob-telemetry-lifecycle-v1',version:VERSION,
 categories:['SIMULATION_STATE','DOMAIN_EVENT','OBSERVATION_TELEMETRY','DIAGNOSTIC_TRACE'],
 simulationState:['AI last decision / scores / fallback state (v35h1c2.aiLast)','AI plans and memory','formation, occupation and war state','recent event-derived gameplay state'],
 domainEvent:['WAR_DECLARED33: target invariant bridge migrated','WAR_ENDED33: legacy side effects pending audit','TILE_OCCUPIED33/TILE_LIBERATED33: legacy side effects pending audit'],
 observation:['telemetry.entries — keep for backward-compatible Devlog and legacy lookups','telemetry.snapshots / yearlySummaries / settlementYearly','D3A food 30-day windows / 1683-column CSV'],
 diagnostics:['35A/35C/35D profilers: reserve','H1C1 snapshot stage profiler: active only during session','H1C gzip storage report: on demand'],
 safety:'No historical Telemetry.record or snapshot producer disabled. Domain-event adapter still forwards through legacy record timing; further decoupling requires dependency parity tests.'
});
function report(w){return {...inventory,at:{year:w?.year,calendarDay:w?.ordinalDay?.(),recordCount:w?.telemetry?.entries?.length,snapshots:w?.telemetry?.snapshots?.length,stateNations:Object.keys(ensure(w)?.aiLast||{}).length},metrics:{...counters}};}
function download(w){const result=report(w);if(typeof document!=='undefined'){
 const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='vilob-v035H1C2-telemetry-lifecycle.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}return result;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1c1Panel')||document.getElementById('v035h1cPanel');if(!host||document.getElementById('v035h1c2Panel'))return;
 const panel=document.createElement('div');panel.className='panel';panel.id='v035h1c2Panel';panel.style.marginTop='10px';panel.innerHTML='<h3>H1C2 · 게임 상태 / 관측 데이터 분리</h3><div class="small muted">AI 결정 상태와 전쟁 필수 처리는 관측 기록과 구별됩니다. 기존 Devlog·Snapshot은 계속 유지합니다.</div><div class="button-grid"><button id="v035h1c2Report">텔레메트리 수명주기 진단 JSON</button></div>';
 host.appendChild(panel);const b=document.getElementById('v035h1c2Report');if(b)b.onclick=()=>download(ui.world);}
const originalRender=NS.UI?.prototype?.renderWorld;if(originalRender)NS.UI.prototype.renderWorld=function(...args){const value=originalRender.apply(this,args);install(this);return value;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-25',title:'Simulation State & Observation Separation V1',summary:'AI 결정 상태 저장 및 게임 사건/관측/진단 분류. 기존 AI 로그·스냅샷·전쟁 처리·RNG 보존. 안전한 구형 콜사이트만 변환.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const oldHeader=NS.UI?.prototype?.renderHeader;if(oldHeader)NS.UI.prototype.renderHeader=function(...args){const r=oldHeader.apply(this,args);badge();return r;};badge();
NS.V035H1C2=Object.freeze({version:VERSION,SimulationState,DomainEvents,Observer,Diagnostics,inventory,report,download});
})(window.VSim);

;
/* H1B2 bundled source: v035h1c3.js */
/* V0.35H1C3 — Occupied physical/accessibility audit, domain event adapters,
 * and profiler-only leaf probes for E/F Snapshot hotpaths.
 * Source game rules, event timing, RNG, logging and retention stay unchanged.
 */
(function(NS){'use strict';
if(!NS?.V034D3||!NS?.V035H1C2||!NS?.V035H1B1)return;
const VERSION='V0.35H1C3';
const count={WAR_DECLARED33:0,WAR_ENDED33:0,TILE_OCCUPIED33:0,TILE_LIBERATED33:0};
// Installed by SHA-preserving build transforms in legacy/125 and legacy/114.
// Explicit dispatch can be used independently of an observation record. Existing
// record call-sites still use handle() at the exact historical position.
const handlers=Object.freeze({...NS.__H1C3DomainHandlers});
delete NS.__H1C3DomainHandlers;
const DomainEvents=Object.freeze({
 types:Object.freeze(Object.keys(count)),
 handle(type,w,payload,fallback){if(Object.prototype.hasOwnProperty.call(count,type))count[type]++;
  return typeof fallback==='function'?fallback(w,payload):handlers[type]?.(w,payload);},
 dispatch(type,w,payload){if(typeof handlers[type]!=='function')throw Error('Unknown H1C3 game event: '+type);
  count[type]++;const out=handlers[type](w,payload);
  // Declaration formerly had a second, later invariant-repair callback in
  // legacy/126. Explicit event dispatch must execute it too, exactly once.
  if(type==='WAR_DECLARED33')NS.V035H1C2.DomainEvents.legacyWarDeclared(w,payload);
  return out;},
 report(){return {...count,registered:Object.keys(handlers)};},
 // Observation producers remain enabled: only explicitly tested event paths
 // have been migrated, and future mutation call-sites must dispatch explicitly.
 observationIndependentComplete:false
});
function measureCall(stage,w,fn,that,args){const meter=NS.V035H1B1?.measureStage;
 return meter?meter(stage,w,fn,that,args):fn.apply(that,args);}
function report(w){const a=NS.V034D3.audit(w);
 const prev=NS.V035H1C2.report(w);
 return {format:'vilob-v035h1c3-integrity-v1',version:VERSION,
  runtimeVersion:VERSION,saveFormatVersion:'V0.35H1B1A',
  at:{year:w?.year,ordinalDay:w?.ordinalDay?.(),calendarOrdinalDay:w?.calendarOrdinalDay?.()},
  d3:{ok:a.ok,errors:a.errors,warnings:a.warnings,
   physical:a.h1c3?.physical,accessible:a.h1c3?.accessible,
   occupiedMemberTiles:a.h1c3?.occupiedMemberTiles,fullyBlockedSettlements:a.h1c3?.fullyBlockedSettlements,poolChecks:a.h1c3?.poolChecks},
  domainEvents:DomainEvents.report(),simulationState:prev.metrics,
  observation:{snapshotCount:w?.telemetry?.snapshots?.length||0,retentionUnchanged:true,csvColumns:1683},
  notes:['Physical stocks include hostile-occupied owned tiles; accessible pool excludes them.',
   'Legacy record() producers remain enabled; the DomainEvents bridge retains old callback timing.',
   'E/F leaf times appear only when an H1B1/H1C1 snapshot profiler session is active.']};}
function download(w){const data=report(w);
 if(typeof document!=='undefined'){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download='vilob-v035H1C3-integrity.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);
 }return data;}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 const host=document.getElementById('v035h1c2Panel')||document.getElementById('v035h1c1Panel');
 if(!host||document.getElementById('v035h1c3Panel'))return;
 const node=document.createElement('div');node.id='v035h1c3Panel';node.className='panel';node.style.marginTop='10px';
 node.innerHTML='<h3>H1C3 · 점령 재고 / 게임 사건 무결성</h3><div class="small muted">물리 재고와 민간 접근 재고를 분리 검증하고 사건 경계 상태를 진단합니다.</div><div class="button-grid"><button id="v035h1c3Report">H1C3 무결성 진단 JSON</button></div>';
 host.appendChild(node);const btn=document.getElementById('v035h1c3Report');if(btn)btn.onclick=()=>download(ui.world);}
const previousUI=NS.UI?.prototype?.renderWorld;
if(previousUI)NS.UI.prototype.renderWorld=function(...args){const out=previousUI.apply(this,args);install(this);return out;};
const oldJSON=NS.Telemetry.prototype.toJSON;
NS.Telemetry.prototype.toJSON=function(w){const out=oldJSON.call(this,w);
 out.version=VERSION;out.runtimeVersion=VERSION;out.saveFormatVersion='V0.35H1B1A';
 if(out.worldSummary){out.worldSummary.runtimeVersion=VERSION;out.worldSummary.saveFormatVersion='V0.35H1B1A';}
 return out;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))
 NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-25',title:'Domain Integrity & Observation Hotpath V1',summary:'점령 타일 물리 재고/민간 접근 재고 감사 분리, DomainEvents 종전·점령·해방 연결 확대, E4/F5 하위 병목 프로파일링 및 진단 날짜·버전 명확화.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const prevHeader=NS.UI?.prototype?.renderHeader;if(prevHeader)NS.UI.prototype.renderHeader=function(...args){const value=prevHeader.apply(this,args);badge();return value;};badge();
NS.V035H1C3=Object.freeze({version:VERSION,DomainEvents,measureCall,report,download});
})(window.VSim);

;
/* H1B2 bundled source: v035h1c4.js */
/* V0.35H1C4 — Stable World diagnostic center + read-only staged profiler probes.
 * Do not change simulation state, RNG, snapshot/CSV schema or saved telemetry.
 */
(function(NS){'use strict';
if(!NS?.V035H1C3||!NS?.UI)return;
const VERSION='V0.35H1C4';
const CATALOG=Object.freeze([
 {id:'v035h1c1Panel',group:'performance',name:'H1C1 · 180일 Snapshot 계층 분석'},
 {id:'v035h1b1Panel',group:'performance',name:'H1B1 · 스냅샷 내부 진단'},
 {id:'v035h1bPanel',group:'performance',name:'H1B · 고정 세계 A/B 성능 비교'},
 {id:'v035aProfilePanel',group:'performance',name:'35A · 전체 실행 함수 계측'},
 {id:'v035cPanel',group:'performance',name:'35C · 분기·행정 계측'},
 {id:'v035dPanel',group:'performance',name:'35D · 사회·경제 계측'},
 {id:'v035ePanel',group:'performance',name:'35E · 주택·건설 계측'},
 {id:'v035fPanel',group:'performance',name:'35F · 개발 판단 계측'},
 {id:'v035h1c3Panel',group:'integrity',name:'H1C3 · 점령 재고·사건 무결성'},
 {id:'v035h1c2Panel',group:'integrity',name:'H1C2 · 시뮬레이션 상태와 관측 분리'},
 {id:'v035gConstructionExports',group:'observation',name:'건설·경로·주거 데이터 내보내기'},
 {id:'v035bAdminPanel',group:'archive',name:'35B · 과거 행정 모델 상세 계측'}
]);
const GROUPS=Object.freeze([
 {id:'performance',name:'성능 프로파일러'},
 {id:'integrity',name:'무결성 검사'},
 {id:'observation',name:'관측·저장 분석'},
 {id:'archive',name:'과거 버전 진단'}
]);
let category='performance',selected='v035h1c1Panel',open=false,installCount=0,lastUI=null;
function mk(tag,id,parent,className){const el=document.createElement(tag);if(id)el.id=id;if(className)el.className=className;parent.appendChild(el);return el;}
function createCenter(){
 // The original panels are generated in one another by old renderWorld wrappers.
 // Each original element and its listeners is moved individually, not recreated.
 const anchor=document.getElementById('h3Advanced')||document.getElementById('h3Diagnostics')||document.getElementById('view-world');
 if(!anchor)return null;
 let root=document.getElementById('v035h1c4Center');if(root)return root;
 const checkpoint=document.getElementById('v035h1aPanel');
 // Ensure checkpoint remains discoverable without opening Developer Diagnostics.
 // Move it *before* moving the old parent 35F/35G tools.
 let dock=document.getElementById('v035h1c4CheckpointDock');
 if(!dock){dock=mk('div','v035h1c4CheckpointDock',anchor);dock.style.margin='10px 0';}
 if(checkpoint&&checkpoint.parentNode!==dock)dock.appendChild(checkpoint);
 root=mk('details','v035h1c4Center',anchor,'panel');root.open=open;root.style.marginTop='12px';
 const summary=mk('summary',null,root);summary.style.cursor='pointer';summary.style.fontWeight='700';summary.style.padding='4px 0';summary.textContent='진단 센터 · 성능 / 무결성 / 관측 / 과거 도구';
 const body=mk('div','v035h1c4Body',root);body.style.padding='10px 0';
 const lead=mk('div',null,body,'small muted');lead.textContent='게임 필수 Simulation State · Domain Events는 진단 도구를 접어도 계속 작동합니다. 각 기존 계측 버튼과 JSON 기능을 유지합니다.';
 const state=mk('div','v035h1c4Status',body,'small muted');state.style.margin='8px 0';
 const nav=mk('div','v035h1c4Nav',body);nav.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:8px 0';
 for(const g of GROUPS){const b=mk('button',null,nav);b.type='button';b.dataset.group=g.id;b.textContent=g.name;b.onclick=()=>{category=g.id;const available=CATALOG.filter(t=>t.group===category&&document.getElementById(t.id));selected=available[0]?.id||'';update();};}
 const line=mk('div',null,body);line.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0';
 const label=mk('label',null,line,'small');label.textContent='진단 선택';label.htmlFor='v035h1c4Select';
 const choice=mk('select','v035h1c4Select',line);choice.style.cssText='max-width:100%;min-width:min(270px,100%);padding:6px';choice.onchange=()=>{selected=choice.value;update();};
 const display=mk('div','v035h1c4Active',body);display.style.marginTop='8px';
 const parking=mk('div','v035h1c4Parking',root);parking.hidden=true;parking.style.display='none';
 // Reject simultaneous *manual* profiler starts before legacy button handlers fire.
 // Existing profiling engines continue to own their own start/stop lifecycles.
 root.addEventListener('click',event=>{
  const button=event.target?.closest?.('button');if(!button)return;
  const startIds=new Set(['v035aStart','v035bBegin','v035cStart','v035dStart','v035eStart','v035fStart','v035h1b1SnapStart','v035h1c1Start']);
  if(!startIds.has(button.id)&&!button.dataset?.h1b)return;
  const active=[NS.V035A?.isActive?.()?'35A':null,NS.V035B?.reportDetail?.()?.active?'35B':null,
   NS.V035C?.isActive?.()?'35C':null,NS.V035D?.isActive?.()?'35D':null,
   NS.V035E?.isActive?.()?'35E':null,NS.V035F?.isActive?.()?'35F':null,
   NS.V035H1B?.isActive?.()?'H1B':null,NS.V035H1B1?.snapshotReport?.()?.active?'Snapshot':null].filter(Boolean);
  if(!active.length)return;
  event.preventDefault();event.stopImmediatePropagation();
  const st=root.querySelector('#v035h1c4Status');if(st)st.textContent='중복 계측 방지 · '+active.join(', ')+' 종료 후 시작해 주세요.';
 },true);
 root.addEventListener('toggle',()=>{open=root.open;});
 return root;
}
function relocate(root){
 const parking=root.querySelector('#v035h1c4Parking');if(!parking)return;
 // Move deepest descendants first to break the historical nested chain.
 // All existing IDs, event handlers, timers and live readouts survive relocation.
 for(const t of CATALOG){const panel=document.getElementById(t.id);if(panel&&panel!==root&&panel.parentElement!==parking&&panel.parentElement?.id!=='v035h1c4Active')parking.appendChild(panel);}
}
function status(){
 // Cheap state checks only: detailed profiler report() builds arrays and the
 // H1C1 full report traverses the 360-window food ledger (never on UI ticks).
 const parts=[];
 const snap=NS.V035H1B1?.snapshotReport?.();
 if(snap?.active)parts.push('Snapshot '+snap.days+'/'+snap.plannedDays+'일 실행 중');
 if(NS.V035H1B?.isActive?.())parts.push('H1B 실행 중');
 if(NS.V035A?.isActive?.())parts.push('35A 실행 중');
 return parts.length?'진행 중 · '+parts.join(' · '):'실행 중인 주요 진단 없음 · 도구 선택 후 시작할 수 있습니다';
}
function update(ui){
 if(typeof document==='undefined')return;
 const root=document.getElementById('v035h1c4Center');if(!root)return;
 const parking=root.querySelector('#v035h1c4Parking'),display=root.querySelector('#v035h1c4Active'),select=root.querySelector('#v035h1c4Select');
 if(!parking||!display||!select)return;
 const existing=CATALOG.filter(t=>t.group===category&&document.getElementById(t.id));
 if(!existing.some(t=>t.id===selected))selected=existing[0]?.id||'';
 for(const t of CATALOG){const el=document.getElementById(t.id);if(!el)continue;
  const target=t.id===selected?display:parking;if(el.parentNode!==target)target.appendChild(el);
  if(t.id===selected){el.hidden=false;el.style.display='';}
 }
 const signature=existing.map(t=>t.id).join('|');if(select.dataset.signature!==signature){select.replaceChildren();for(const t of existing){const opt=document.createElement('option');opt.value=t.id;opt.textContent=t.name;select.appendChild(opt);}select.dataset.signature=signature;}
 if(existing.length)select.value=selected;
 for(const b of root.querySelectorAll('[data-group]')){const isActive=b.dataset.group===category;b.setAttribute('aria-pressed',String(isActive));b.style.fontWeight=isActive?'700':'400';b.style.opacity=isActive?'1':'.75';}
 const st=root.querySelector('#v035h1c4Status'),stateText=status();if(st)st.textContent=stateText;
 const summary=root.firstElementChild||root.children?.[0];
 if(summary)summary.textContent=stateText.startsWith('진행 중')?'진단 센터 · 실행 중 ('+stateText.slice(7)+')':'진단 센터 · 성능 / 무결성 / 관측 / 과거 도구';
 const note=root.querySelector('#v035h1c4Empty');if(note)note.remove();
 if(!existing.length){const p=mk('div','v035h1c4Empty',display,'small muted');p.textContent='이 범주의 기존 진단 패널이 현재 화면에 없습니다.';}
}
function install(ui){if(typeof document==='undefined'||!ui?.world)return;
 lastUI=ui;const root=createCenter();if(!root)return;
 relocate(root);update(ui);installCount++;
}
const priorWorld=NS.UI.prototype.renderWorld;
NS.UI.prototype.renderWorld=function(...args){const out=priorWorld.apply(this,args);install(this);return out;};
// Distinguish runtime release from the deliberately unchanged save schema.
const previousJSON=NS.Telemetry?.prototype?.toJSON;
if(previousJSON)NS.Telemetry.prototype.toJSON=function(w,...args){
 const data=previousJSON.call(this,w,...args);data.version=VERSION;data.runtimeVersion=VERSION;
 if(data.worldSummary)data.worldSummary.runtimeVersion=VERSION;
 return data;
};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-26',title:'Snapshot Hotpath & Diagnostic Center V1',summary:'세계 탭 개발 진단 도구를 성능·무결성·관측·과거 기능으로 통합. H1C3 게임 규칙·RNG·관측 스키마 보존, E/F 스냅샷 상세 경계 확장.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const prevHeader=NS.UI.prototype.renderHeader;if(prevHeader)NS.UI.prototype.renderHeader=function(...args){const value=prevHeader.apply(this,args);badge();return value;};badge();
NS.V035H1C4=Object.freeze({version:VERSION,catalog:CATALOG,groups:GROUPS,install,report:()=>({version:VERSION,selected,group:category,renderCount:installCount,stageNames:['C4_PRE_E4_099','C4_PRE_E4_105','C4_E4_108','C4_E4_TO_F_112','C4_F1_115','C4_F5_119','C4_F5A_122']}),installCount:()=>installCount});
})(window.VSim);

;
/* H1B2 bundled source: v035h1c5.js */
/* V0.35H1C5 — F5A Snapshot Attach Hotpath V1.
 * F5A full attach / repairs remain before base snapshot.
 * F5 Snapshot skips only the second consecutive updateMonetary call: attach already does it.
 * No gameplay, RNG, save schema, telemetry retention or CSV changes.
 */
(function(NS){'use strict';
if(!NS?.V035H1C4||!NS?.Telemetry||!NS?.UI)return;
const VERSION='V0.35H1C5';
const original=NS.Telemetry.prototype.toJSON;
if(typeof original==='function')NS.Telemetry.prototype.toJSON=function(w,...args){const d=original.call(this,w,...args);d.version=VERSION;d.runtimeVersion=VERSION;if(d.worldSummary)d.worldSummary.runtimeVersion=VERSION;return d;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-26',title:'F5A Snapshot Attach Hotpath V1',summary:'F5 Snapshot의 연속 화폐 갱신 중복 1회를 제거하고 F5A attach의 세부 계측을 추가. 모든 연결·점령·전쟁 보정은 그대로 유지.'});
function badge(){if(typeof document==='undefined')return;const b=document.getElementById('versionBadge');if(b){b.textContent='Village Observer · '+VERSION;b.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const previous=NS.UI.prototype.renderHeader;
if(previous)NS.UI.prototype.renderHeader=function(...args){const r=previous.apply(this,args);badge();return r;};badge();
NS.V035H1C5=Object.freeze({version:VERSION,description:'Remove duplicate F5 monetary refresh after attach; profile F5A attach',stageNames:['C5_F5A_ATTACH']});
})(window.VSim);

;
/* H1B2 bundled source: v035h1c6.js */
/* V0.35H1C6 — Legacy Attach Chain Attribution V1.
 * Separates the protected F5A Snapshot attach chain into nested, disjoint leaf
 * timing stages. Does not suppress, memoize, reorder, or migrate any attach work.
 * Recording is scoped to the one synchronous F5A snapshot attach invocation.
 */
(function(NS){'use strict';
if(!NS?.V035H1C5||!NS?.V035H1B1||!NS?.Telemetry)return;
const VERSION='V0.35H1C6';
const links=[
 ['V032E8','C6_ATTACH_32E8'],['V032E9','C6_ATTACH_32E9'],
 ['V032E10','C6_ATTACH_32E10'],['V032E11','C6_ATTACH_32E11'],
 ['V032E12','C6_ATTACH_32E12'],['V032E14','C6_ATTACH_32E14'],
 ['V032F','C6_ATTACH_32F'],['V033','C6_ATTACH_33'],
 ['V033A','C6_ATTACH_A'],['V033B','C6_ATTACH_B'],['V033C','C6_ATTACH_C'],
 ['V033C1','C6_ATTACH_C1'],['V033C2','C6_ATTACH_C2'],
 ['V033C3','C6_ATTACH_C3'],['V033C3F','C6_ATTACH_C3F'],['V033D','C6_ATTACH_D'],
 ['V033D1','C6_ATTACH_D1'],['V033D1A','C6_ATTACH_D1A'],
 ['V033D1B','C6_ATTACH_D1B'],['V033D1C','C6_ATTACH_D1C'],
 ['V033D2','C6_ATTACH_D2'],['V033D2A','C6_ATTACH_D2A'],
 ['V033E','C6_ATTACH_E'],['V033E1','C6_ATTACH_E1'],
 ['V033E2','C6_ATTACH_E2'],['V033E3','C6_ATTACH_E3'],
 ['V033E4','C6_ATTACH_E4'],['V033E4A','C6_ATTACH_E4A'],
 ['V033E5','C6_ATTACH_E5'],['V033E5F','C6_ATTACH_E5F'],
 ['V033E5F1','C6_ATTACH_E5F1'],['V033E5F2','C6_ATTACH_E5F2'],
 ['V033F','C6_ATTACH_F'],['V033F1','C6_ATTACH_F1'],
 ['V033F2','C6_ATTACH_F2'],['V033F3','C6_ATTACH_F3'],
 ['V033F4','C6_ATTACH_F4'],['V033F5','C6_ATTACH_F5'],
 ['V033F5P1','C6_ATTACH_F5P1'],['V033F5P2','C6_ATTACH_F5P2']
];
let scope=null;
const wrapped=[];
for(const [name,stage] of links){
 const group=NS[name],fn=group?.attachWorld;
 if(typeof fn!=='function')continue;
 // Runtime API namespace remains the same object, only this method is wrapped.
 // All wrappers share exact this, arguments, return value and throw behavior.
 const measured=function(...args){
  const w=args[0];
  if(scope!==w)return fn.apply(this,args);
  return NS.V035H1B1.measureStage(stage,w,fn,this,args);
 };
 group.attachWorld=measured;
 if(group.attachWorld!==measured)throw Error('H1C6 attach wrapper install failed: '+name);
 wrapped.push(stage);
}
function runAttach(w,fn){
 const prev=scope;
 scope=w;
 try{return NS.V035H1B1.measureStage('C5_F5A_ATTACH',w,fn,null,[w]);}
 finally{scope=prev;}
}
const previousJSON=NS.Telemetry.prototype.toJSON;
if(typeof previousJSON==='function')NS.Telemetry.prototype.toJSON=function(w,...args){const out=previousJSON.call(this,w,...args);out.version=VERSION;out.runtimeVersion=VERSION;if(out.worldSummary)out.worldSummary.runtimeVersion=VERSION;return out;};
NS.RELEASE_VERSION=VERSION;
if(Array.isArray(NS.PATCH_NOTES)&&!NS.PATCH_NOTES.some(x=>x.version===VERSION))NS.PATCH_NOTES.unshift({version:VERSION,date:'2026-10-26',title:'Legacy Attach Chain Attribution V1',summary:'F5A Snapshot attach 체인의 단계별 배타 비용·호출 횟수를 분리 계측. 연결/수리/초기화 및 RNG·이벤트·CSV 값 보존.'});
function badge(){if(typeof document==='undefined')return;const el=document.getElementById('versionBadge');if(el){el.textContent='Village Observer · '+VERSION;el.dataset.runtimeVersion=VERSION;}document.title='Village Observer '+VERSION;}
const h=NS.UI?.prototype?.renderHeader;if(h)NS.UI.prototype.renderHeader=function(...args){const out=h.apply(this,args);badge();return out;};badge();
NS.V035H1C6=Object.freeze({version:VERSION,runAttach,stageNames:wrapped,description:'Profile nested F5A attachWorld stages without changing work or output'});
})(window.VSim);

;