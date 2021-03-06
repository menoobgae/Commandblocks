var t=this;
this.global.colors={};
this.global.colors.grid=false;
const sprayrad=3;
const sprayper=0.15;
const dirs=[[1,0],[0,1],[-1,0],[0,-1]];
const colorcanvas = extendContent(LightBlock, "colorcanvas", {
  /*
  playerPlaced(tile){
    tile.configure(t.global.colors.brushcolor["U-"+Vars.player.name]);
  },
  */
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
    this.gridRegion=Core.atlas.find(this.name+"-top");
  },
  draw(tile){
    //var entity=tile.ent();
    Draw.color(Tmp.c1.set(tile.ent().color));
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color();
    if(t.global.colors.grid) Draw.rect(this.gridRegion, tile.drawx(), tile.drawy());
  },
  minimapColor(tile){
    return tile.ent().color;
  },
  trycolor(tile,color){
    if(tile.block()!=this){
      //print("Color:failed");
      return;
    }
    try{
      tile.ent().color=color;
      if(!Vars.headless){
        Vars.renderer.minimap.update(tile);
      }
    }
    catch(err){
      print("Color:"+err);
    }
  },
  tapped(tile,player){
    switch(t.global.colors.brushtype["U-"+player.name]){
      case 0:
        tile.ent().color=t.global.colors.brushcolor["U-"+player.name];
        if(!Vars.headless){
          Vars.renderer.minimap.update(tile);
        }
      break;
      case 1:
        tile.ent().color=-1;
        if(!Vars.headless){
          Vars.renderer.minimap.update(tile);
        }
      break;
      case 2:
        tile.ent().color=t.global.colors.brushcolor["U-"+player.name];
        this.trycolor(Vars.world.tile(tile.x  ,tile.y+1),tile.ent().color);
        this.trycolor(Vars.world.tile(tile.x+1,tile.y  ),tile.ent().color);
        this.trycolor(Vars.world.tile(tile.x  ,tile.y-1),tile.ent().color);
        this.trycolor(Vars.world.tile(tile.x-1,tile.y  ),tile.ent().color);
        if(!Vars.headless){
          Vars.renderer.minimap.update(tile);
        }
      break;
      case 3:
        var spraycolor=t.global.colors.brushcolor["U-"+player.name];
        for(var i=-1*sprayrad;i<=sprayrad;i++){
          for(var j=-1*sprayrad;j<=sprayrad;j++){
            if(Math.random()<sprayper){
              this.trycolor(Vars.world.tile(tile.x+i,tile.y+j),spraycolor);
            }
          }
        }
      break;
      case 6:
      //cannot use recursive funcs
        var newcolor=t.global.colors.brushcolor["U-"+player.name];
        var startcolor=tile.ent().color;
        if(newcolor==startcolor) return;
        var q=[]; //var visit=[];
        q.push(Vec2(tile.x,tile.y));
        tile.ent().color=newcolor;
        if(!Vars.headless){
          Vars.renderer.minimap.update(tile);
        }
        while(q.length>0){
          var last=q.shift();
          //visit.push(last);

          for(var i=0;i<4;i++){
            var ctile=Vars.world.tile(last.x+dirs[i][0],last.y+dirs[i][1]);
            if(ctile.block()!=this) continue;
            if(ctile.ent().color==startcolor){
              //print("Fill:"+ctile.x+","+ctile.y);
              q.push(Vec2(ctile.x,ctile.y));
              Vars.world.tile(ctile.x,ctile.y).ent().color=newcolor;
              if(!Vars.headless){
                Vars.renderer.minimap.update(ctile);
              }
            }
            else{
              //print("Fill:border/"+ctile.x+","+ctile.y);
            }
          }
        }
      break;
      case 7:
        t.global.colors.brushcolor["U-"+player.name]=tile.ent().color;
      break;
    }
  },
  configured(tile, player, value){
    //tile.ent().color = value;
    tile.ent().color=value;
  },
  placed(tile){
    this.super$placed(tile);
    tile.ent().color=-1;
  },
  drawLight(tile){
    //
  },
  buildConfiguration(tile,table){
    //
  },
  playerPlaced(tile){
    /*
    tile.ent().color=t.global.colors.brushcolor["U-"+Vars.player.name];
    if(!Vars.headless){
      Vars.renderer.minimap.update(tile);
    }*/
  },
  drawRequestRegion(req,list){
    var reg = this.icon(Cicon.full);
    if(req.config!=0) Draw.color(Tmp.c1.set(req.config));
    Draw.rect(this.icon(Cicon.full), req.drawx(), req.drawy(),reg.getWidth() * req.animScale * Draw.scl,reg.getHeight() * req.animScale * Draw.scl,0);
    if(req.config!=0) Draw.color();
  }
});

/*
colorcanvas.entityType=prov(() => extendContent(TileEntity , colorcanvas , {
  config(){
    return this._color.rgba();
  },
  _color:new Color(1,1,1,1),
  write(stream){
    this.super$write(stream);
    stream.writeInt(this._color.rgba());
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._color=Tmp.c1.set(stream.readInt());
  },
  getColor(){
    return this._color;
  },
  setitem(item){
    this._color=item;
  }
}));
*/

colorcanvas.hasPower=false;
colorcanvas.configurable=false;
/*
colorcanvas.entityType=prov(() => extendContent(LightBlock.LightEntity , colorcanvas , {
}));
*/
