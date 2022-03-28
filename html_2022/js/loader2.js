$(function(){
    introEvent.init();
    gnbEvent.init();
    inEvent.init();
    selEvent.init();
    swiperEvent.init();
    footEvent.init();
    workEvent.init();
    aboutEvent.init();
    contactEvent.init();
    fsUpload.init();
    layerPop.init();
//    $("html, body").stop().animate({ scrollTop:0 });
});

$(window).resize(function(){
    var filter = "win16|win32|win64|mac|macintel";
    if(navigator.platform){
        if(filter.indexOf(navigator.platform.toLowerCase()) < 0){}
        else{
            //pc
            gnbEvent.setDevice();
            introEvent.init();
        }
    }
});

var dataUrl = "js/dataJson.js";

// intro event
var introEvent = {
    eventTime:1000,
    init:function(){
        var _ = this;
        var windowHeight = $(window).height();
        $(".intro_box").css("line-height",windowHeight+"px");
        $(".intro_ani .hidden_box").stop().animate({ height:13 }, this.eventTime, function(){
            $(".intro_ani .hidden_box").css("height","100%");
            $(".intro_ani .hidden_box").stop().animate({ height:0 }, _.eventTime, function(){
                $("body").removeClass("intro");
                $(".intro_box .intro_ani").stop().fadeOut(500,function(){
                    _.contentInit();
                    mapOffice.init();
                });
            });
        });
    },
    contentInit:function(){
        $(".intro_box").css("background","transparent");
        $(".intro_box .ani_box").removeClass("blind");
        $(".intro_box .ani_box.left").stop().animate({ left:0, width:0 }, 2000);
        $(".intro_box .ani_box.right").stop().animate({ right:0, width:0 }, 2000);

        setTimeout(function(){
            $(".main_visual").stop().animate({ marginTop:0, opacity:1 }, 700);
            $(".visual_notice").stop().animate({ marginTop:0, opacity:1 }, 700);
            $(".intro_box").addClass("blind");
            gnbEvent.setDevice();
        }, 300);
    }
};

/* work event */
var workEvent = {
    aniTime:300,
    showCnt:10,
    visibleIdx:0,
    isCategory:"all",
    categoryArr:[],
    currentScroll:0,
    init:function(){
        this.setList();
        this.showMore();
    },
    setList:function(){
        var _ = this;
        var windowWidth = $(window).width();
        if(windowWidth <= 768){
          this.showCnt = 5;
        }
        ajaxManager.getData(dataUrl,function(data){
            var dataList = data.list;
            var dataLen = data.list.length;
            var lastIdx = dataLen-1;
            _.visibleIdx = lastIdx-_.showCnt;
            var html = "";
            for(var i=lastIdx; i>=_.visibleIdx; i--){
                var imgWidth = Number(dataList[i].size.split(",")[0] / 20);
                var imgHeight = dataList[i].size.split(",")[1] / 20;
                html += "<li class='grid-item "+dataList[i].type+"' style='width:"+imgWidth+"rem; height:"+imgHeight+"rem;'>";
                    html += "<a href='javascript:;' onclick=workEvent.detailContent('"+dataList[i].seq+"');>";
                        html += "<img src='images/works/work_list"+dataList[i].seq+".png' alt='"+dataList[i].title+"' class='pc' />";
                        html += "<img src='images/works/m_work_list"+dataList[i].seq+".png' alt='"+dataList[i].title+"' class='mobile' />";
                        html += "<div class='data_box'>";
                        if(dataList[i].title_color != undefined){
                            html += "<p class='tit "+dataList[i].title_color+"'>"+dataList[i].title+"</p>";
                            html += "<p class='notice "+dataList[i].notice_color+"'>"+dataList[i].notice+"</p>";
                            html += "<p class='period "+dataList[i].period_color+"'>"+dataList[i].period+"</p>";
                        }else{
                            html += "<p class='tit'>"+dataList[i].title+"</p>";
                            html += "<p class='notice'>"+dataList[i].notice+"</p>";
                            html += "<p class='period'>"+dataList[i].period+"</p>";
                        }
                        html += "</div>";
                        html += "<span class='bgitem' style='width:"+(imgWidth+1)+"rem; height:"+(imgHeight+1)+"rem;'><img src='images/icon/btn_more.png' /></span>";
                    html += "</a>";
                html += "</li>";
            }

            $grid = $(".grid").isotope({
                filter: ".grid-item",
                originTop: true,
                resize: false,
                layoutMode: "packery",
                itemSelector: ".grid-item",
                packery:{
                    percentPosition: true,
                    gutter:20
                }
            });

            $grid.isotope("insert",$(html));
            _.listHover();
            _.categoryEvent();

            sameWord.init();
        });
    },
    listHover:function(){
        var _ = this;
        $(".works_list .list_view ul li a").hover(function(){
            var listHeight = $(this).parent().height();
            $(this).find(".bgitem").css("opacity",1);
            $(this).find(".bgitem").css("line-height",listHeight+"px");
            $(this).find(".bgitem img").stop().animate({ opacity:1, marginTop:0 }, _.aniTime);
        },function(){
            $(this).find(".bgitem").css("opacity",0);
            $(this).find(".bgitem").css("line-height",0);
            $(this).find(".bgitem img").stop().animate({ opacity:0, marginTop:"30%" }, _.aniTime);
        });
    },
    showMore:function(){
        var _ = this;
        var filter = "win16|win32|win64|mac|macintel";
        if(navigator.platform){
            if(filter.indexOf(navigator.platform.toLowerCase()) < 0){}
            else{
                //pc
                $(".view_more a").hover(function(){
                    $(this).stop().animate({ backgroundColor:"#000", color:"#fff" }, _.aniTime);
                },function(){
                    $(this).stop().animate({ backgroundColor:"#f5f5f5", color:"#000" }, _.aniTime);
                });
            }
        }

        $(".view_more a").on("click",function(){
            if(_.isCategory != "all"){
                var lastIdx = _.visibleIdx-1;
                _.visibleIdx = _.visibleIdx-_.showCnt;
                var html = "";

                if(_.visibleIdx < 10){
                    _.visibleIdx = 0;
                    $(".view_more a").addClass("blind");
                }else{
                    $(".view_more a").removeClass("blind");
                }

                for(var i=lastIdx; i>=_.visibleIdx; i--){
                    var imgWidth = Number(_.categoryArr[i].size.split(",")[0] / 20);
                    var imgHeight = _.categoryArr[i].size.split(",")[1] / 20;

                    html += "<li class='grid-item "+_.categoryArr[i].type+"' style='width:"+imgWidth+"rem; height:"+imgHeight+"rem;'>";
                        html += "<a href='javascript:;' onclick=workEvent.detailContent('"+_.categoryArr[i].seq+"');>";
                            html += "<img src='images/works/work_list"+_.categoryArr[i].seq+".png' alt='"+_.categoryArr[i].title+"' class='pc' />";
                            html += "<img src='images/works/m_work_list"+_.categoryArr[i].seq+".png' alt='"+_.categoryArr[i].title+"' class='mobile' />";
                            html += "<div class='data_box'>";
                            if(_.categoryArr[i].title_color != undefined){
                                html += "<p class='tit "+_.categoryArr[i].title_color+"'>"+_.categoryArr[i].title+"</p>";
                                html += "<p class='notice "+_.categoryArr[i].notice_color+"'>"+_.categoryArr[i].notice+"</p>";
                                html += "<p class='period "+_.categoryArr[i].period_color+"'>"+_.categoryArr[i].period+"</p>";
                            }else{
                                html += "<p class='tit'>"+_.categoryArr[i].title+"</p>";
                                html += "<p class='notice'>"+_.categoryArr[i].notice+"</p>";
                                html += "<p class='period'>"+_.categoryArr[i].period+"</p>";
                            }
                            html += "</div>";
                            html += "<span class='bgitem' style='width:"+(imgWidth+1)+"rem; height:"+(imgHeight+1)+"rem;'><img src='images/icon/btn_more.png' /></span>";
                        html += "</a>";
                    html += "</li>";
                }

                $grid.isotope("insert",$(html));
                _.listHover();
                sameWord.init();
            }else{
                ajaxManager.getData(dataUrl,function(data){
                    var dataList = data.list;
                    var lastIdx = _.visibleIdx-1;
                    _.visibleIdx = _.visibleIdx-_.showCnt;
                    if(lastIdx < 10){
                        _.visibleIdx = 0;
                        $(".view_more a").addClass("blind");
                    }
                    var html = "";
                    for(var i=lastIdx; i>=_.visibleIdx; i--){
                        var imgWidth = Number(dataList[i].size.split(",")[0] / 20);
                        var imgHeight = dataList[i].size.split(",")[1] / 20;
                        html += "<li class='grid-item "+dataList[i].type+"' style='width:"+imgWidth+"rem; height:"+imgHeight+"rem;'>";
                            html += "<a href='javascript:;' onclick=workEvent.detailContent('"+dataList[i].seq+"');>";
                                html += "<img src='images/works/work_list"+dataList[i].seq+".png' alt='"+dataList[i].title+"' class='pc' />";
                                html += "<img src='images/works/m_work_list"+dataList[i].seq+".png' alt='"+dataList[i].title+"' class='mobile' />";
                                html += "<div class='data_box'>";
                                if(dataList[i].title_color != undefined){
                                    html += "<p class='tit "+dataList[i].title_color+"'>"+dataList[i].title+"</p>";
                                    html += "<p class='notice "+dataList[i].notice_color+"'>"+dataList[i].notice+"</p>";
                                    html += "<p class='period "+dataList[i].period_color+"'>"+dataList[i].period+"</p>";
                                }else{
                                    html += "<p class='tit'>"+dataList[i].title+"</p>";
                                    html += "<p class='notice'>"+dataList[i].notice+"</p>";
                                    html += "<p class='period'>"+dataList[i].period+"</p>";
                                }
                                html += "</div>";
                                html += "<span class='bgitem' style='width:"+(imgWidth+1)+"rem; height:"+(imgHeight+1)+"rem;'><img src='images/icon/btn_more.png' /></span>";
                            html += "</a>";
                        html += "</li>";
                    }

                    $grid.isotope("insert",$(html));
                    _.listHover();

                    sameWord.init();
                });
            }
        });
    },
    categoryEvent:function(){
        var _  = this;

        //PC Event
        $(".workBox .works_list .view_category ul li a").unbind("click");
        $(".workBox .works_list .view_category ul li a").on("click",function(){
            _.categoryArr = [];
            $(".workBox .works_list .view_category ul li").removeClass("active");
            $(this).parent().addClass("active");
            _.isCategory = $(this).attr("alt");
            $grid.isotope("remove", $(".grid-item")).isotope("layout");

            ajaxManager.getData(dataUrl,function(data){
                var isData = [];
                var dataList = data.list;
                var dataLen = data.list.length;
                for(var j=0; j<dataLen; j++){
                    if(dataList[j].category.indexOf(_.isCategory) > -1){
                        isData.push(dataList[j]);
                        _.categoryArr.push(dataList[j]);
                    }
                }

                var lastIdx = isData.length-1;
                _.visibleIdx = lastIdx-_.showCnt;
                var html = "";

                if(_.visibleIdx < 10){
                    _.visibleIdx = 0;
                    $(".view_more a").addClass("blind");
                }else{
                    $(".view_more a").removeClass("blind");
                }

                for(var i=lastIdx; i>=_.visibleIdx; i--){
                    var imgWidth = Number(isData[i].size.split(",")[0] / 20);
                    var imgHeight = isData[i].size.split(",")[1] / 20;

                    html += "<li class='grid-item "+isData[i].type+"' style='width:"+imgWidth+"rem; height:"+imgHeight+"rem;'>";
                        html += "<a href='javascript:;' onclick=workEvent.detailContent('"+isData[i].seq+"');>";
                            html += "<img src='images/works/work_list"+isData[i].seq+".png' alt='"+isData[i].title+"' class='pc' />";
                            html += "<img src='images/works/m_work_list"+isData[i].seq+".png' alt='"+isData[i].title+"' class='mobile' />";
                            html += "<div class='data_box'>";
                            if(isData[i].title_color != undefined){
                                html += "<p class='tit "+isData[i].title_color+"'>"+isData[i].title+"</p>";
                                html += "<p class='notice "+isData[i].notice_color+"'>"+isData[i].notice+"</p>";
                                html += "<p class='period "+isData[i].period_color+"'>"+isData[i].period+"</p>";
                            }else{
                                html += "<p class='tit'>"+isData[i].title+"</p>";
                                html += "<p class='notice'>"+isData[i].notice+"</p>";
                                html += "<p class='period'>"+isData[i].period+"</p>";
                            }
                            html += "</div>";
                            html += "<span class='bgitem' style='width:"+(imgWidth+1)+"rem; height:"+(imgHeight+1)+"rem;'><img src='images/icon/btn_more.png' /></span>";
                        html += "</a>";
                    html += "</li>";
                }

                $grid.isotope("insert",$(html));
                _.listHover();
                sameWord.init();
            });
        });

        //Mobile Event
        $("#sel_category").on("change",function(){
            _.isCategory = $(this).val();
            $grid.isotope("remove", $(".grid-item")).isotope("layout");

            ajaxManager.getData(dataUrl,function(data){
                var isData = [];
                var dataList = data.list;
                var dataLen = data.list.length;
                for(var j=0; j<dataLen; j++){
                    if(dataList[j].category.indexOf(_.isCategory) > -1){
                        isData.push(dataList[j]);
                        _.categoryArr.push(dataList[j]);
                    }
                }

                var lastIdx = isData.length-1;
                _.visibleIdx = lastIdx-_.showCnt;
                var html = "";

                if(_.visibleIdx < 10){
                    _.visibleIdx = 0;
                    $(".view_more a").addClass("blind");
                }else{
                    $(".view_more a").removeClass("blind");
                }

                for(var i=lastIdx; i>=_.visibleIdx; i--){
                    var imgWidth = Number(isData[i].size.split(",")[0] / 20);
                    var imgHeight = isData[i].size.split(",")[1] / 20;

                    html += "<li class='grid-item "+isData[i].type+"' style='width:"+imgWidth+"rem; height:"+imgHeight+"rem;'>";
                        html += "<a href='javascript:;' onclick=workEvent.detailContent('"+isData[i].seq+"');>";
                            html += "<img src='images/works/work_list"+isData[i].seq+".png' alt='"+isData[i].title+"' class='pc' />";
                            html += "<img src='images/works/m_work_list"+isData[i].seq+".png' alt='"+isData[i].title+"' class='mobile' />";
                            html += "<div class='data_box'>";
                            if(isData[i].title_color != undefined){
                                html += "<p class='tit "+isData[i].title_color+"'>"+isData[i].title+"</p>";
                                html += "<p class='notice "+isData[i].notice_color+"'>"+isData[i].notice+"</p>";
                                html += "<p class='period "+isData[i].period_color+"'>"+isData[i].period+"</p>";
                            }else{
                                html += "<p class='tit'>"+isData[i].title+"</p>";
                                html += "<p class='notice'>"+isData[i].notice+"</p>";
                                html += "<p class='period'>"+isData[i].period+"</p>";
                            }
                            html += "</div>";
                            html += "<span class='bgitem' style='width:"+(imgWidth+1)+"rem; height:"+(imgHeight+1)+"rem;'><img src='images/icon/btn_more.png' /></span>";
                        html += "</a>";
                    html += "</li>";
                }

                $grid.isotope("insert",$(html));
                _.listHover();
                sameWord.init();
            });
        });
    },
    detailContent:function(idx){
        var _ = this;
        this.currentScroll = $(window).scrollTop();

        $("html, body").addClass("intro");
        $(".popup_work").removeClass("blind");
        var curIdx = idx;
        var rootPath = "images/works/view/";
        var curPCImg = rootPath+"view"+curIdx+"_pc.jpg";
        var curLogo = "images/works/logo/view_logo"+curIdx+".png";
        var curMImg00 = rootPath+"view"+curIdx+"_m00.jpg";
        var curMImg01 = rootPath+"view"+curIdx+"_m01.jpg";

        $(".popup_work a.pop_close").on("click",function(){
            $(".popup_work").animate({ scrollTop:0 }, 0);
            $(".popup_work").addClass("blind");
            $("html, body").removeClass("intro");
            $("html, body").stop().animate({ scrollTop:_.currentScroll },0);
        });

        ajaxManager.getData(dataUrl,function(data){
            if(curIdx == '00'){ curIdx = 0; }
            else{ curIdx = curIdx.replace(/^0+/, ''); }

            var dataList = data.list;
            var infoTitle = dataList[curIdx].title;
            var infoNotice = dataList[curIdx].notice;
            var infoPopNotice = dataList[curIdx].pop_notice;
            var infoClient = dataList[curIdx].client;
            var infoCategory = dataList[curIdx].category_tit;
            var infoPeriod = dataList[curIdx].period;
            var infoBackground = dataList[curIdx].backgroundColor;

            $(".popup_work .work_info .info_tit").html(infoTitle);
            $(".popup_work .work_info .info_comments").html(infoPopNotice);
            $(".popup_work .work_info .info_list ul li .info_client").text(infoClient);
            $(".popup_work .work_info .info_list ul li .info_category").text(infoCategory);
            $(".popup_work .work_info .info_list ul li .info_period").text(infoPeriod);
            $(".popup_work .detail_view .view_box .view_area.right_box ").css("background",infoBackground);

            $(".popup_work .detail_view .view_box .view_area .view_logo img").attr("src",curLogo);

            $(".popup_work .detail_view .view_box .view_area .work_info .website img").attr("src", curPCImg);
            $(".popup_work .detail_view .view_box .view_area .work_info .mobile img").eq(0).attr("src", curMImg00);
            $(".popup_work .detail_view .view_box .view_area .work_info .mobile img").eq(1).attr("src", curMImg01);

            $(".popup_work .detail_view .view_box .view_area .work_info img").each(function(idx){
                $(this).parent().removeClass("blind");
                $(this).on("error",function(){
                    $(this).unbind("error");
                    $(this).parent().addClass("blind");
                });
            });

            $(".popup_work .detail_view .view_box .view_area .work_info .website .area_tit").text("website");
            $(".popup_work .detail_view .view_box .view_area .work_info .mobile .area_tit").text("mobile");
            switch(curIdx){
                case "70":
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile").addClass("list"+curIdx);
                    return false;
                case "69":
                    var cateName = $(".popup_work .detail_view .view_box .view_area .work_info .info_list ul li .info_category").text();
                    var cateWeb = cateName.split(",")[0];
                    var cateMo = cateName.split(",")[1];
                    $(".popup_work .detail_view .view_box .view_area .work_info .website .area_tit").text(cateWeb);
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile .area_tit").text(cateMo);
                    return false;
                case "76":
                    var cateName = $(".popup_work .detail_view .view_box .view_area .work_info .info_list ul li .info_category").text();
                    var cateWeb = cateName.split(",")[0];
                    var cateMo = cateName.split(",")[1];
                    $(".popup_work .detail_view .view_box .view_area .work_info .website .area_tit").text(cateWeb);
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile .area_tit").text(cateMo);
                    setTimeout(function(){
                      $(".popup_work .detail_view .view_box .view_area .work_info .mobile").removeClass("blind");
                      $(".popup_work .detail_view .view_box .view_area .work_info .mobile img:last-of-type").addClass("blind");
                    }, 500);
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile img:first-of-type").css("margin-top","5%");
                    return false;
                default:
                    $(".popup_work .detail_view .view_box .view_area .work_info .website .area_tit").text("website");
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile .area_tit").text("mobile");
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile").attr("class","mobile");
                    $(".popup_work .detail_view .view_box .view_area .work_info .mobile img:first-of-type").css("margin-top","0");
                    return false;
            }

        });
    }
};

/* about event */
var aboutEvent = {
    listCnt:0,
    boxCnt:0,
    listTime:200,
    isScroll:false,
    init:function(){
        this.setList();
        this.scrollEvent();
        swiperEvent.aboutInit();
    },
    setList:function(){
        $(".aboutBox .about_business .circle_box .box_digit ul li").stop().fadeOut(this.listTime);
        //empty visible
        $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(0).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(4).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(0).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(2).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(3).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(4).stop().fadeIn(0);
    },
    listEvent:function(){
        var _  = this;
//        $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(1).stop().animate({ opacity:1 }, _.listTime, function(){
//            $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(2).stop().animate({ opacity:1 }, _.listTime,function(){
//                $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(3).stop().animate({ opacity:1 }, _.listTime,function(){
//                    $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(4).stop().animate({ opacity:1 }, _.listTime ,function(){
//                        $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(0).stop().animate({ opacity:1 }, _.listTime, function(){
//                            $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(1).stop().animate({ opacity:1 }, _.listTime,function(){
//                                $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(2).stop().animate({ opacity:1 }, _.listTime,function(){
//                                    $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(3).stop().animate({ opacity:1 }, _.listTime, function(){
//                                        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(1).stop().animate({ opacity:1 }, _.listTime);
//                                    });
//                                });
//                            });
//                        });
//                    });
//                });
//            });
//        });

        $(".aboutBox .about_business .circle_box .box_digit ul li").stop().fadeOut(_.listTime);
        //empty visible
        $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(0).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(4).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(0).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(2).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(3).stop().fadeIn(0);
        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(4).stop().fadeIn(0);

        $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(1).stop().fadeIn(_.listTime,function(){
            $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(2).stop().fadeIn(_.listTime,function(){
                $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(3).stop().fadeIn(_.listTime,function(){
                    $(".aboutBox .about_business .circle_box .box_digit").eq(0).find("ul li").eq(4).stop().fadeIn(_.listTime,function(){
                        $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(0).stop().fadeIn(_.listTime,function(){
                            $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(1).stop().fadeIn(_.listTime,function(){
                                $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(2).stop().fadeIn(_.listTime,function(){
                                    $(".aboutBox .about_business .circle_box .box_digit").eq(1).find("ul li").eq(3).stop().fadeIn(_.listTime,function(){
                                        $(".aboutBox .about_business .circle_box .box_digit").eq(2).find("ul li").eq(1).stop().fadeIn(_.listTime);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        this.isScroll = true;

    },
    scrollEvent:function(){
        var _ = this;
        $(window).scroll(function(){
            if(_.isScroll){return false;}
            var curTop = $(window).scrollTop();
            //var scrollAbout = $(".aboutBox .about_list").offset().top;
            var scrollAbout = $(".aboutBox").offset().top;
            if(curTop > scrollAbout - 500){
                _.listEvent();
            }
        });
    }
};
